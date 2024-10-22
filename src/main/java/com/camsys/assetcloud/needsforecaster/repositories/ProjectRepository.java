package com.camsys.assetcloud.needsforecaster.repositories;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.Project;
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
            "and (:#{#filter.sogr} is null or p.sogr = :#{#filter.sogr}) " +
            "and (:#{#filter.manual} is null or p.manual = :#{#filter.manual}) "
    )
    List<Project> findByFilter(@Param("filter") ProjectFilter filter);

    @Query("select p from Project p")
    List<Project> list();
}
