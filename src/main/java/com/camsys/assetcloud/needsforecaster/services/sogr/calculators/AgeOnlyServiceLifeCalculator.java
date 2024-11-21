package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service("AgeOnlyServiceLifeCalculator")
public class AgeOnlyServiceLifeCalculator extends ServiceLifeCalculatorBase implements ServiceLifeCalculator {
    @Override
    public void calculate(Asset asset, PolicySubRule policySubRule) {
        LocalDate replacementDate = addMonths(asset.inServiceDate, policySubRule.eslMonths);
        asset.policyReplacementYear = replacementDate.getYear();//TODO: turn replacementDate into fiscal Year
    }
}
