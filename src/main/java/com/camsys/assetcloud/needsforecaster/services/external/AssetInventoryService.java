package com.camsys.assetcloud.needsforecaster.services.external;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;

import java.util.List;

public interface AssetInventoryService {
    List<Org> getOrgs();
    List<Asset> getActiveAssets(String orgKey, List<String> assetTypeKeys) throws Exception;
    void broadcastAssetUpdates(List<Asset> assets);
    void setToken(String token);
    String testRoundTrip();
}
