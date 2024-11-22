package com.camsys.assetcloud.needsforecaster.services.external;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class WebClientAssetInventoryService implements AssetInventoryService {
    @Override
    public List<Org> getOrgs() {
        //TODO: use web client to get list of orgs
        return List.of();
    }

    @Override
    public List<Asset> getActiveAssets(String orgKey, List<String> assetTypeKeys) {
        //TODO: use web client to get list of assets
        return List.of();
    }

    @Override
    public void broadcastAssetUpdates(List<Asset> assets) {
        //TODO: use web client to post asset data changes to asset inventory module
    }
}
