package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;

public interface ServiceLifeCalculator {
    void calculate(Asset asset, PolicySubRule policySubRule);
}
