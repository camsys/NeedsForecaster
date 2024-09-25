package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.controller.exceptions.EntityNotFoundException;
import com.camsys.assetcloud.needsforecaster.controller.exceptions.PolicySubRuleException;
import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyListDTO;
import com.camsys.assetcloud.needsforecaster.model.PolicyRule;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRuleRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicySubRuleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@RestController
public class PoliciesController {

    private final PolicyRuleRepository policyRuleRepository;
    private final PolicySubRuleRepository policySubRuleRepository;
    private final PolicyRepository policyRepository;

    public PoliciesController(PolicyRepository policyRepository,
                              PolicyRuleRepository policyRuleRepository,
                              PolicySubRuleRepository policySubRuleRepository) {
        this.policyRepository = policyRepository;
        this.policyRuleRepository = policyRuleRepository;
        this.policySubRuleRepository = policySubRuleRepository;
    }

    @GetMapping(value = "/api/policies", produces = "application/json")
    public List<PolicyListDTO> listPoliciesByOrganization(@RequestParam(required = false, value = "orgKey") String organizationKey) {
        return policyRepository.findByOrg(organizationKey).stream().map(PolicyListDTO::new).collect(Collectors.toList());
    }

    @GetMapping(value = "/api/policies/{id}", produces = "application/json")
    public Policy getPolicyById(@PathVariable(value = "id") Long policyId) {
        return policyRepository.findById(policyId)
                .orElseThrow(() -> new EntityNotFoundException("Policy", policyId));
    }

    @PutMapping(value = "/api/policies/{id}", consumes = "application/json", produces = "application/json")
    public Policy editPolicy(@PathVariable(value = "id") Long policyId, @RequestBody Policy policy) {

        return policyRepository.findById(policyId).map(toBeEditedPolicy -> {
                    if (policy.description != null && !toBeEditedPolicy.description.equals(policy.description)) {
                        toBeEditedPolicy.description = policy.description;
                        return policyRepository.save(toBeEditedPolicy);
                    }
                    return toBeEditedPolicy;
                })
                .orElseThrow(() -> new EntityNotFoundException("Policy", policyId));
    }

    @PutMapping(value = "/api/policy-rules/{id}", consumes = "application/json", produces = "application/json")
    public PolicyRule editPolicyRule(@PathVariable(value = "id") Long policyRuleId, @RequestBody PolicyRule policyRule) {

        return policyRuleRepository.findById(policyRuleId).map(toBeEditedPolicyRule -> {
                    if (policyRule.serviceLifeCalculationMethod != null &&
                            !toBeEditedPolicyRule.serviceLifeCalculationMethod.equals(policyRule.serviceLifeCalculationMethod)) {

                        toBeEditedPolicyRule.serviceLifeCalculationMethod = policyRule.serviceLifeCalculationMethod;
                        toBeEditedPolicyRule.updatedOn = new Date();
                        return policyRuleRepository.save(toBeEditedPolicyRule);
                    }
                    return toBeEditedPolicyRule;
                })
                .orElseThrow(() -> new EntityNotFoundException("PolicyRule", policyRuleId));
    }

    @PostMapping(value = "/api/policy-sub-rules", consumes = "application/json", produces = "application/json")
    public PolicySubRule editOrCreatePolicySubRule(@RequestBody PolicySubRule policySubRule) {
        return policySubRuleRepository.findById(policySubRule.id).map(toBeEditedPolicySubRule -> {
                    boolean hasChanged = false;
                    if (toBeEditedPolicySubRule.eslMonths != policySubRule.eslMonths) {
                        toBeEditedPolicySubRule.eslMonths = policySubRule.eslMonths;
                        hasChanged = true;
                    }
                    if (toBeEditedPolicySubRule.eslMiles != policySubRule.eslMiles) {
                        toBeEditedPolicySubRule.eslMiles = policySubRule.eslMiles;
                        hasChanged = true;
                    }

                    if (hasChanged) {
                        toBeEditedPolicySubRule.policyRule.updatedOn = new Date();//Do we need to update this when subrule changes?
                        return policySubRuleRepository.save(toBeEditedPolicySubRule);
                    }
                    return toBeEditedPolicySubRule;
                })
                .orElseGet(() -> createPolicySubRule(policySubRule));
    }

    private PolicySubRule createPolicySubRule(PolicySubRule policySubRule) {
        //make sure id is not specified since we don't want to accidentally overwrite an existing subrule in this method
        if ((policySubRule.id == null || policySubRule.id == 0L) && policySubRule.validateCustom()) {
            policySubRule.isCustom = true;//make sure this is marked as a custom subrule
            return policySubRuleRepository.save(policySubRule);
        }
        else throw new PolicySubRuleException("Policy SubRule not valid for creation", policySubRule);
    }

    @DeleteMapping(value = "/api/policy-sub-rules/{id}", consumes = "application/json", produces = "application/json")
    public void deletePolicySubRule(@PathVariable(value = "id") Long policySubRuleId) {

        PolicySubRule toBeDeletedPolicySubRule = policySubRuleRepository.findById(policySubRuleId)
                .orElseThrow(() -> new EntityNotFoundException("PolicySubRule", policySubRuleId));

        if (toBeDeletedPolicySubRule.isCustom) {
            policySubRuleRepository.delete(toBeDeletedPolicySubRule);
        }
        else throw new PolicySubRuleException("Policy SubRule not valid for deletion", toBeDeletedPolicySubRule);
    }


    //temporary!!!
    //use to create sample data on demand
//    @GetMapping(value = "/api/policies/sample", produces = "application/json")
//    public void sampleData(@RequestParam(required = false, value = "orgKey") String organizationKey) {
//        SamplePoliciesData sampleData = new SamplePoliciesData();

//        sampleData.createSamplePoliciesData(policyRepository);

//        Optional<Policy> one = policyRepository.findById(1L);
//        if (one.isPresent()) {
//            sampleData.createSamplePolicyRuleData(policyRuleRepository, one.get());
//            sampleData.createAllPolicySubRuleData(policySubRuleRepository, one.get());
//        }
//    }
}
