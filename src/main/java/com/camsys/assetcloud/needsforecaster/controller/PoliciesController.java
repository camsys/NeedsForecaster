package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyListDTO;
import com.camsys.assetcloud.needsforecaster.model.PolicyRule;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRuleRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicySubRuleRepository;
import com.camsys.assetcloud.needsforecaster.sampledata.SamplePoliciesData;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    @GetMapping(value = "/api/policies/list", produces = "application/json")
    public List<PolicyListDTO> listPoliciesByOrganization(@RequestParam(required = false, value = "orgKey") String organizationKey) {
        return policyRepository.findByOrg(organizationKey).stream().map(PolicyListDTO::new).collect(Collectors.toList());
    }

    @GetMapping(value = "/api/policies/{id}", produces = "application/json")
    public Policy getPolicyById(@PathVariable(value = "id") Long policyId) {
        return policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
    }

    @PostMapping(value = "/api/policy/edit", consumes = "application/json", produces = "application/json")
    public Policy editPolicy(@RequestBody Policy policy) {

        return policyRepository.findById(policy.id).map(toBeEditedPolicy -> {
                    if (policy.description != null && !toBeEditedPolicy.description.equals(policy.description)) {
                        toBeEditedPolicy.description = policy.description;
                        return policyRepository.save(toBeEditedPolicy);
                    }
                    return toBeEditedPolicy;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));
    }

    @PostMapping(value = "/api/policy-rule/edit", consumes = "application/json", produces = "application/json")
    public PolicyRule editPolicyRule(@RequestBody PolicyRule policyRule) {

        return policyRuleRepository.findById(policyRule.id).map(toBeEditedPolicyRule -> {
                    if (policyRule.serviceLifeCalculationMethod != null &&
                            !toBeEditedPolicyRule.serviceLifeCalculationMethod.equals(policyRule.serviceLifeCalculationMethod)) {

                        toBeEditedPolicyRule.serviceLifeCalculationMethod = policyRule.serviceLifeCalculationMethod;
                        toBeEditedPolicyRule.updatedOn = new Date();
                        return policyRuleRepository.save(toBeEditedPolicyRule);
                    }
                    return toBeEditedPolicyRule;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Policy Rule not found"));
    }

    @PostMapping(value = "/api/policy-sub-rule/edit", consumes = "application/json", produces = "application/json")
    public PolicySubRule editPolicySubRule(@RequestBody PolicySubRule policySubRule) {

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
                .orElseThrow(() -> new ResourceNotFoundException("Policy SubRule not found"));

    }

    @PutMapping(value = "/api/policy-sub-rule/", consumes = "application/json", produces = "application/json")
    public PolicySubRule createPolicySubRule(@RequestBody PolicySubRule policySubRule) {
        if (policySubRule.validateCustom()) {
            policySubRule.isCustom = true;//make sure this is marked as a custom subrule
            return policySubRuleRepository.save(policySubRule);
        }
        else throw new IllegalArgumentException("Policy SubRule not valid for creation");
    }

    @DeleteMapping(value = "/api/policy-sub-rule/{id}", consumes = "application/json", produces = "application/json")
    public void deletePolicySubRule(@PathVariable(value = "id") Long policySubRuleId) {

        PolicySubRule toBeDeletedPolicySubRule = policySubRuleRepository.findById(policySubRuleId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy SubRule not found"));

        if (toBeDeletedPolicySubRule.isCustom) {
            policySubRuleRepository.delete(toBeDeletedPolicySubRule);
        }
        else throw new IllegalArgumentException("Policy SubRule not valid for deletion");
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
