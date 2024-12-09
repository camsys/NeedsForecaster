package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProjectBuilderRunRepository extends CrudRepository<ProjectBuilderRun, Long> {

    @Query("select r from ProjectBuilderRun r order by r.createdOn desc")
    List<ProjectBuilderRun> list();

    @Query("update ProjectBuilderRun r set r.numProjectsInRange = " +
            "(select count(distinct p.id) from Project p join p._assets a " +
            "where p.sogr = true and p.fiscalYear >= :#{#run.fiscalYear} and p.fiscalYear < :#{#run.fiscalYear} + :#{#run.yearRange} " +
            "and p.ownerOrganization = :#{#run.ownerOrganization} " +
            "and a.assetTypeKey in (:#{#run.assetTypeKeys}))" +
            "where r.id = :#{#run.id}")
    @Modifying
    @Transactional
    void updateRunProjectCount(@Param("run") ProjectBuilderRun run);
}
