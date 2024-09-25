package com.camsys.assetcloud.needsforecaster.sampledata;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyRule;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRuleRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicySubRuleRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class SamplePoliciesData {

    public void createSamplePoliciesData(PolicyRepository policyRepository) {
        List<Policy> policies = new ArrayList<>();
        Policy policy = new Policy();
        policy.name = "FY 2017 Statewide Transit Policy (Current)";
        policy.description = "Main policy";
        policy.ownerOrganization = "bpt";
        policies.add(policy);

        policy = new Policy();
        policy.name = "FY 2016 Statewide Transit Policy";
        policy.description = "alternate policy";
        policy.ownerOrganization = "bpt";
        policies.add(policy);

        policy = new Policy();
        policy.name = "FY 2015 Statewide Transit Policy";
        policy.description = "third policy option";
        policy.ownerOrganization = "bpt";
        policies.add(policy);

        policy = new Policy();
        policy.name = "Another Transit Policy for org2";
        policy.description = "another policy description";
        policy.ownerOrganization = "org2";
        policies.add(policy);

        policy = new Policy();
        policy.name = "Another Transit Policy for org3";
        policy.description = "another policy description";
        policy.ownerOrganization = "org3";
        policies.add(policy);

        policyRepository.saveAll(policies);
    }

    public void createSamplePolicyRuleData(PolicyRuleRepository policyRuleRepository, Policy policy) {
        PolicyRule policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "admin";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age Only";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "buses";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age and Mileage";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "capital_equip";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age Only";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "ferries";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age Only";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "maintenance";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age and Mileage";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "other_passenger_veh";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age and Mileage";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "parking";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age Only";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "rail_cars";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age and Mileage";
        policyRuleRepository.save(policyRule);

        policyRule = new PolicyRule();
        policyRule.policy = policy;
        policyRule.assetTypeKey = "service_veh_nonrev";
        policyRule.updatedOn = new Date();
        policyRule.createdOn = new Date();
        policyRule.serviceLifeCalculationMethod = "Age and Mileage";
        policyRuleRepository.save(policyRule);
    }

    public void createAllPolicySubRuleData(PolicySubRuleRepository policySubRuleRepository, Policy policy) {
        Optional<PolicyRule> admin = policy.rules.stream().filter(rule -> "admin".equals(rule.assetTypeKey)).findFirst();
        admin.ifPresent(policyRule -> createSamplePolicySubRuleData(policySubRuleRepository, policyRule));
    }

    public void createSamplePolicySubRuleData(PolicySubRuleRepository policySubRuleRepository, PolicyRule policyRule) {
        PolicySubRule policySubRule = new PolicySubRule();
        policySubRule.policyRule = policyRule;
        policySubRule.assetSubType = "Hardware";
        policySubRule.eslMonths = 48;
        policySubRule.policyRule.updatedOn = new Date();
        policySubRuleRepository.save(policySubRule);

        policySubRule = new PolicySubRule();
        policySubRule.policyRule = policyRule;
        policySubRule.assetSubType = "Software";
        policySubRule.eslMonths = 48;
        policySubRule.policyRule.updatedOn = new Date();
        policySubRuleRepository.save(policySubRule);

        policySubRule = new PolicySubRule();
        policySubRule.policyRule = policyRule;
        policySubRule.assetSubType = "Networks";
        policySubRule.eslMonths = 144;
        policySubRule.policyRule.updatedOn = new Date();
        policySubRuleRepository.save(policySubRule);

        policySubRule = new PolicySubRule();
        policySubRule.policyRule = policyRule;
        policySubRule.assetSubType = "Storage";
        policySubRule.eslMonths = 144;
        policySubRule.policyRule.updatedOn = new Date();
        policySubRuleRepository.save(policySubRule);

        policySubRule = new PolicySubRule();
        policySubRule.policyRule = policyRule;
        policySubRule.assetSubType = "Other IT Equipment";
        policySubRule.eslMonths = 144;
        policySubRule.policyRule.updatedOn = new Date();
        policySubRuleRepository.save(policySubRule);
    }
}
