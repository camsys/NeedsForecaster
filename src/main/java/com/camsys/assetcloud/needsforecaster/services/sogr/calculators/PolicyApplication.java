package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Policy;

public interface PolicyApplication {
    void apply(Policy policy, Asset asset);
}
