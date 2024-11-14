package com.camsys.assetcloud.needsforecaster.services.sogr.builder;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Project;

import java.util.ArrayList;
import java.util.List;

public abstract class SogrBuilderBase {
    protected List<Asset> determineDisposedAssets(List<Project> sogrProjects, List<Asset> activeAssets) {

        List<Asset> toBeRemoved = new ArrayList<>();
        for (Project project : sogrProjects) {
            List<Asset> disposed = new ArrayList<>();
            for (Asset asset : project.assets) {
                List<Asset> sameTypeAssets = activeAssets.stream().filter(a -> asset.assetTypeKey.equals(a.assetTypeKey)).toList();
                if (sameTypeAssets != null && !sameTypeAssets.contains(asset)) {//are we updating the project's asset type and is the asset still active
                    //asset in project is no longer active (has been disposed)
                    disposed.add(asset);
                }
            }
            project.assets.removeAll(disposed);
            toBeRemoved.addAll(disposed);
        }
        return toBeRemoved;
    }

    protected List<Project> findEmptyProjects(List<Project> sogrProjects) {
        List<Project> toBeRemoved = new ArrayList<>();
        for (Project project : sogrProjects) {
            if (project.assets.isEmpty()) {
                toBeRemoved.add(project);
            }
        }
        return toBeRemoved;
    }

    protected void placeAssetInCorrectProject(List<Project> sogrProjects, Asset asset, int year, String projectType) {

        boolean assetInProject = false;
        for (Project project : sogrProjects) {
            if (project.assets.contains(asset)) {//already in project
                if (project.fiscalYear.intValue() != year) project.assets.remove(asset);//but shouldn't be
                else assetInProject = true;
            }
            else if (project.fiscalYear.intValue() == year &&
                    project.ownerOrganization.equals(asset.orgKey) &&
                    asset.assetTypeKey.equals(project.assetTypeKey())) {//asset not in project
                project.assets.add(asset);//but should be
                assetInProject = true;
            }
        }

        if (!assetInProject) {//asset needs new project
            Project newProject = new Project();
            newProject.assets = new ArrayList<>();
            newProject.assets.add(asset);
            newProject.fiscalYear = year;
            newProject.projectType = projectType;
            newProject.sogr = true;
            newProject.ownerOrganization = asset.orgKey;
            newProject.name = projectType + " project for " + asset.assetTypeKey;
            newProject.description = "SOGR Project";
            sogrProjects.add(newProject);
        }

    }
}
