package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.controller.exceptions.EntityNotFoundException;
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
        if (organizationKey == null || organizationKey.isBlank())
            return policyRepository.list().stream().map(PolicyListDTO::new).collect(Collectors.toList());
        else
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

    @PutMapping(value = "/api/policy-sub-rules/{id}", consumes = "application/json", produces = "application/json")
    public PolicySubRule editPolicySubRule(@PathVariable(value = "id") Long policySubRuleId, @RequestBody PolicySubRule policySubRule) {
        return policySubRuleRepository.findById(policySubRuleId).map(toBeEditedPolicySubRule -> {
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
                .orElseThrow(() -> new EntityNotFoundException("PolicySubRule", policySubRuleId));
    }
}
