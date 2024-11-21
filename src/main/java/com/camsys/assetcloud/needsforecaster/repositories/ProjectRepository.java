package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.Project;
import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.model.ProjectFilter;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends CrudRepository<Project, Long> {

    //when comparing the string parameter to null, need to declare type for the null check (a postgres requirement)
    @Query("select p from Project p " +
            "where ((cast(:#{#filter.ownerOrganization} as string) is null) or p.ownerOrganization = :#{#filter.ownerOrganization}) " +
            "and (:#{#filter.fiscalYear} is null or p.fiscalYear = :#{#filter.fiscalYear}) " +
            "and ((cast(:#{#filter.projectType} as string) is null) or p.projectType = :#{#filter.projectType}) " +
            "and (:#{#filter.sogr} is null or p.sogr = :#{#filter.sogr}) "
    )
    List<Project> findByFilter(@Param("filter") ProjectFilter filter);

    @Query("select p from Project p")
    List<Project> list();

    @Query("select max(p.fiscalYear) from Project p")
    Integer getMaxProjectFiscalYear();

    @Query("select p from Project p " +
            "where p.sogr = true and p.fiscalYear >= :#{#run.fiscalYear} and p.fiscalYear < :#{#run.fiscalYear} + :#{#run.yearRange} " +
            "and p.ownerOrganization = :#{#run.ownerOrganization}")
    List<Project> findByRun(@Param("run") ProjectBuilderRun run);
}
