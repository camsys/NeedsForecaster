package com.camsys.assetcloud.needsforecaster.services.external;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;

import java.util.List;

public interface AssetInventoryService {
    List<Org> getOrgs(String token);
    List<Asset> getActiveAssets(String token, String orgKey, List<String> assetTypeKeys) throws Exception;
    void broadcastAssetUpdates(String token, List<Asset> assets);
    void setServer(String callingServerName);
}
