package com.camsys.assetcloud.needsforecaster.model;

import javax.validation.constraints.NotNull;

public class ProjectFilter {

    public String ownerOrganization;
    public Integer fiscalYear;
    public Boolean sogr;
    public String projectType;
    public Boolean manual;
}
