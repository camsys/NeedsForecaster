package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyListDTO;
import com.camsys.assetcloud.needsforecaster.model.PolicyRule;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRuleRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicySubRuleRepository;
import com.camsys.assetcloud.needsforecaster.sampledata.SamplePoliciesData;
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
    public Optional<Policy> getPolicyById(@PathVariable(value = "id") Long policyId) {
        return policyRepository.findById(policyId);
    }

    @PostMapping(value = "/api/policy/edit", consumes = "application/json", produces = "application/json")
    public Policy editPolicy(@RequestBody Policy policy) {
        Optional<Policy> savedPolicy;
        try {
            //fetch saved policy
            savedPolicy = getPolicyById(policy.id);

            if (savedPolicy.isPresent()) {
                //see if the description field has changed
                if (policy.description != null && !savedPolicy.get().description.equals(policy.description)) {
                    savedPolicy.get().description = policy.description;
                    return policyRepository.save(savedPolicy.get());
                } else return savedPolicy.get();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
        //TODO: need error handling in response/catch
    }

    @PostMapping(value = "/api/policy-rule/edit", consumes = "application/json", produces = "application/json")
    public PolicyRule editPolicyRule(@RequestBody PolicyRule policyRule) {
        Optional<PolicyRule> savedPolicyRule;
        try {
            //fetch saved policy rule
            savedPolicyRule = policyRuleRepository.findById(policyRule.id);

            if (savedPolicyRule.isPresent()) {
                //see if the service life calc method field has changed
                if (policyRule.serviceLifeCalculationMethod != null &&
                        !savedPolicyRule.get().serviceLifeCalculationMethod.equals(policyRule.serviceLifeCalculationMethod)) {
                    savedPolicyRule.get().serviceLifeCalculationMethod = policyRule.serviceLifeCalculationMethod;

                    savedPolicyRule.get().updatedOn = new Date();
                    return policyRuleRepository.save(savedPolicyRule.get());
                } else return savedPolicyRule.get();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
        //TODO: need error handling in response/catch
    }

    @PostMapping(value = "/api/policy-sub-rule/edit", consumes = "application/json", produces = "application/json")
    public PolicySubRule editPolicySubRule(@RequestBody PolicySubRule policySubRule) {
        Optional<PolicySubRule> savedPolicySubRule;
        try {
            //fetch saved policy rule
            savedPolicySubRule = policySubRuleRepository.findById(policySubRule.id);

            if (savedPolicySubRule.isPresent()) {
                //see if the updatable fields have changed
                boolean hasChanged = false;
                if (savedPolicySubRule.get().eslMonths != policySubRule.eslMonths) {
                    savedPolicySubRule.get().eslMonths = policySubRule.eslMonths;
                    hasChanged = true;
                }
                if (savedPolicySubRule.get().eslMiles != policySubRule.eslMiles) {
                    savedPolicySubRule.get().eslMiles = policySubRule.eslMiles;
                    hasChanged = true;
                }

                if (hasChanged) {
                    savedPolicySubRule.get().policyRule.updatedOn = new Date();
                    return policySubRuleRepository.save(savedPolicySubRule.get());
                } else return savedPolicySubRule.get();
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
        //TODO: need error handling in response/catch
    }

    @PutMapping(value = "/api/policy-sub-rule/", consumes = "application/json", produces = "application/json")
    public PolicySubRule createPolicySubRule(@RequestBody PolicySubRule policySubRule) {
        try {
            if (policySubRule.validate()) {
                policySubRule.isCustom = true;//make sure this is marked as a custom subrule
                return policySubRuleRepository.save(policySubRule);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
        //TODO: need error handling in response/catch
    }

    @DeleteMapping(value = "/api/policy-sub-rule/{id}", consumes = "application/json", produces = "application/json")
    public PolicySubRule deletePolicySubRule(@PathVariable(value = "id") Long policySubRuleId) {
        Optional<PolicySubRule> savedPolicySubRule;
        try {
            //fetch saved policy
            savedPolicySubRule = policySubRuleRepository.findById(policySubRuleId);
            savedPolicySubRule.ifPresent(policySubRuleRepository::delete);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
        //TODO: need error handling in response/catch
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
