package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProjectBuilderRunRepository extends CrudRepository<ProjectBuilderRun, Long> {

    @Query("select r from ProjectBuilderRun r")
    List<ProjectBuilderRun> list();

    @Query("select r from ProjectBuilderRun r " +
            "where r.status = com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunStatus.WAITING " +
            "order by r.createdOn asc")
    List<ProjectBuilderRun> listWaiting();

    @Query("select r from ProjectBuilderRun r " +
            "where r.status = com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunStatus.PROCESSING")
    List<ProjectBuilderRun> listProcessing();
}
