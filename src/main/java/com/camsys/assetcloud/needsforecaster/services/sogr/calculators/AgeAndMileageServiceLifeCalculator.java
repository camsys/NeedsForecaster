package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import com.camsys.assetcloud.needsforecaster.services.Utility;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service("AgeAndMileageServiceLifeCalculator")
public class AgeAndMileageServiceLifeCalculator extends ServiceLifeCalculatorBase implements ServiceLifeCalculator {
    @Override
    public void calculate(Asset asset, PolicySubRule policySubRule) {
        boolean mileageThresholdReached = asset.odometer >= policySubRule.eslMiles;
        LocalDate replacementDateByAge = addMonths(asset.inServiceDate, policySubRule.eslMonths);
        int replacementYearByAge = Utility.getFiscalYear(replacementDateByAge);

        if (mileageThresholdReached) {
            asset.policyReplacementYear = Math.max(Utility.getCurrentFiscalYear() + 1, replacementYearByAge);
        }
        else {
            asset.policyReplacementYear = Math.max(Utility.getCurrentFiscalYear()  + 2, replacementYearByAge);
        }

    }
}
