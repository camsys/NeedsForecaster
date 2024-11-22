package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import org.springframework.data.repository.CrudRepository;

public interface AssetRepository extends CrudRepository<Asset, Long> {

    Asset findByUniqueKey(String uniqueKey);
}
