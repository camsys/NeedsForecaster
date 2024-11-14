package com.camsys.assetcloud.needsforecaster.model;

public class ProjectListDTO {

    private Project project;
    public ProjectListDTO(Project project) {
        this.project = project;
    }

    public Long getId() { return project.id; };

    public String getName() { return project.name; };

    public String getDescription() { return project.description; };

    public String getOwnerOrganization() { return project.ownerOrganization; };

    public Integer getFiscalYear() { return project.fiscalYear; }

    public String getProjectType() { return project.projectType; };

    public boolean getSogr() { return project.sogr; }
}
