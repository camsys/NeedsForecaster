package com.camsys.assetcloud.needsforecaster.services;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;

import java.util.List;

public interface AssetInventoryService {
    List<Org> getOrgs();
    List<Asset> getActiveAssets(String orgKey, String assetTypeKey);
}
