package com.camsys.assetcloud.needsforecaster.dataimport;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyRule;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRuleRepository;
import com.camsys.assetcloud.needsforecaster.repositories.PolicySubRuleRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Date;

@Service
public class InitialData {

    private final PolicyRepository policyRepository;
    private final PolicyRuleRepository policyRuleRepository;
    private final PolicySubRuleRepository policySubRuleRepository;

    public InitialData(PolicyRepository policyRepository, PolicyRuleRepository policyRuleRepository, PolicySubRuleRepository policySubRuleRepository) {
        this.policyRepository = policyRepository;
        this.policyRuleRepository = policyRuleRepository;
        this.policySubRuleRepository = policySubRuleRepository;
    }

    public void load() throws IOException {

        //only load if there is no policy already in the database
        if (policyRepository.count() == 0) {
            System.out.println("Creating main policy...");
            Policy policy = new Policy();
            policy.name = "Demo Master Policy";
            policy.description = "Active policy for all agencies under Demo";
            policy.ownerOrganization = "demo";

            policy = policyRepository.save(policy);
            createPolicyRules(policy);
        }
        else System.out.println("Policy already exists - no data loaded");

    }

    private void createPolicyRules(Policy policy) throws IOException {

        Reader assetTypeIn = new FileReader("./data/AssetTypes.csv");
        Iterable<CSVRecord> assetTypeRecords = CSVFormat.RFC4180.builder()
                .setHeader("AssetType", "SLCMethod", "SubTypeFileName")
                .setSkipHeaderRecord(true)
                .build()
                .parse(assetTypeIn);
        for (CSVRecord atRecord : assetTypeRecords) {

            PolicyRule rule = new PolicyRule();
            rule.assetType = atRecord.get("AssetType");
            rule.serviceLifeCalculationMethod = atRecord.get("SLCMethod");
            String subTypeFileName = atRecord.get("SubTypeFileName");
            rule.createdOn = new Date();
            rule.updatedOn = new Date();
            rule.policy = policy;

            rule = policyRuleRepository.save(rule);

            rule.subRules = new ArrayList<>();

            Reader subTypesIn = new FileReader("./data/" + subTypeFileName);
            Iterable<CSVRecord> subTypeRecords = CSVFormat.RFC4180.builder()
                    .setHeader("SubType", "ESLMonths", "ESLMiles")
                    .setSkipHeaderRecord(true)
                    .build()
                    .parse(subTypesIn);

            for (CSVRecord stRecord : subTypeRecords) {
                PolicySubRule subRule = new PolicySubRule();
                subRule.assetSubType = stRecord.get("SubType");
                subRule.policyRule = rule;
                if (!stRecord.get("ESLMonths").isEmpty()) subRule.eslMonths = Integer.parseInt(stRecord.get("ESLMonths"));
                if (!stRecord.get("ESLMiles").isEmpty()) subRule.eslMiles = Integer.parseInt(stRecord.get("ESLMiles"));
                rule.subRules.add(subRule);
            }

            policySubRuleRepository.saveAll(rule.subRules);
        }
    }
}
