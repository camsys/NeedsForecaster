package com.camsys.assetcloud.needsforecaster.model;

import com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
public class ProjectBuilderRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    public String runKey;

    @NotNull
    public String ownerOrganization;

    @NotNull
    public Integer fiscalYear;

    @NotNull
    public Integer yearRange;

    @ElementCollection(fetch = FetchType.EAGER)
    public List<String> assetTypeKeys;

    @NotNull
    @Enumerated(EnumType.STRING)
    public ProjectBuilderRunStatus status = ProjectBuilderRunStatus.NEW;

    @NotNull
    public Date createdOn;

    @NotNull
    public Date completeOn;

    @JsonIgnore
    @ManyToMany
    public List<Project> projects;

}
