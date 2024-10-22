package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    public String name;

    @NotNull
    public String description;

    @NotNull
    public String ownerOrganization;

    @NotNull
    public Integer fiscalYear;

    @NotNull
    public String projectType;

    public boolean sogr;

    public boolean manual;
}
