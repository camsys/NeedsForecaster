package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service("AgeAndMileageServiceLifeCalculator")
public class AgeAndMileageServiceLifeCalculator extends ServiceLifeCalculatorBase implements ServiceLifeCalculator {
    @Override
    public void calculate(Asset asset, PolicySubRule policySubRule) {
        boolean mileageThresholdReached = asset.odometer >= policySubRule.eslMiles;
        LocalDate replacementDateByAge = addMonths(asset.inServiceDate, policySubRule.eslMonths);
        int replacementYearByAge = replacementDateByAge.getYear();//TODO: turn replacementDate into fiscal Year

        if (mileageThresholdReached) {
            asset.policyReplacementYear = Math.max(getCurrentYear() + 1, replacementYearByAge);//TODO: make sure current year is actual current fiscal year
        }
        else {
            asset.policyReplacementYear = Math.max(getCurrentYear() + 2, replacementYearByAge);//TODO: make sure current year is actual current fiscal year
        }

    }
}
