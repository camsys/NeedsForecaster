package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Policy;
import org.springframework.stereotype.Service;

@Service
public class ReplacementYearPolicyApplication implements PolicyApplication {

    @Override
    public void apply(Policy policy, Asset asset) {
        //TODO: replace with real algorithm
        asset.policyReplacementYear = 2031;
    }
}
