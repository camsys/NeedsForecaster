package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProjectBuilderRunRepository extends CrudRepository<ProjectBuilderRun, Long> {

    @Query("select r from ProjectBuilderRun r")
    List<ProjectBuilderRun> list();
}
