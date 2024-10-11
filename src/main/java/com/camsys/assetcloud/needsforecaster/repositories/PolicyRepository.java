package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PolicyRepository extends CrudRepository<Policy, Long> {

    @Query("select p from Policy p where p.ownerOrganization = :#{#orgKey}")
    List<Policy> findByOrg(@Param("orgKey") String orgKey);

    @Query("select p from Policy p")
    List<Policy> list();
}
