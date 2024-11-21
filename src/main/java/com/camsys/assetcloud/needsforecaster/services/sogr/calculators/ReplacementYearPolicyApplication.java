package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyRule;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ReplacementYearPolicyApplication implements PolicyApplication {
    private final ApplicationContext applicationContext;

    public ReplacementYearPolicyApplication(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void apply(Policy policy, Asset asset) {

        //get policy rule relevant for asset
        PolicyRule policyRule = policy.rules.stream().filter(rule -> rule.assetType.equals(asset.assetTypeKey)).findFirst().orElseThrow();

        //set service life calculator to correct type
        ServiceLifeCalculator serviceLifeCalculator = getServiceLifeCalculator(policyRule.serviceLifeCalculationMethod);

        PolicySubRule policySubRule = policyRule.subRules.stream().filter(subrule -> subrule.assetSubType.equals(asset.assetSubTypeKey)).findFirst().orElseThrow();
        serviceLifeCalculator.calculate(asset, policySubRule);
    }

    private ServiceLifeCalculator getServiceLifeCalculator(String serviceLifeCalculationMethod) {
        //set service life calculator to correct type
        switch (serviceLifeCalculationMethod) {
            case ServiceLifeCalculatorBase.AGE_ONLY:
                return applicationContext.getBean("AgeOnlyServiceLifeCalculator", ServiceLifeCalculator.class);
            case ServiceLifeCalculatorBase.AGE_AND_MILEAGE:
                return applicationContext.getBean("AgeAndMileageServiceLifeCalculator", ServiceLifeCalculator.class);
            default:
                throw new NoSuchElementException("Policy rule service life calculation method not supported: " + serviceLifeCalculationMethod);
        }
    }
}
