package com.camsys.assetcloud.needsforecaster.services.sogr.builder;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.Project;
import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.model.enums.ProjectType;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

public abstract class SogrBuilderBase implements SogrBuilder {

    //adds the context when executed asynchronously and also make sure this build happens on its own transaction
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public abstract void build(ProjectBuilderRun run);

    public abstract Policy getCurrentPolicy(String orgKey);

    protected List<Asset> determineDisposedAssets(List<String> assetTypeKeys, List<Project> sogrProjects, List<Asset> activeAssets) {

        List<Asset> toBeRemoved = new ArrayList<>();

        //take the assets from all the sogr projects and filter to just the asset types that are being updated by the run
        //compare that list to what assets are still active
        sogrProjects.stream().flatMap(p -> p.getAssets().stream())
                .filter(sogrAsset -> assetTypeKeys.contains(sogrAsset.assetTypeKey))
                .forEach(asset -> {
                    if (!activeAssets.contains(asset)) {
                        toBeRemoved.add(asset);
                    }
                });

        return toBeRemoved;
    }

    protected List<Project> findEmptyProjects(List<Project> sogrProjects) {
        List<Project> toBeRemoved = new ArrayList<>();
        for (Project project : sogrProjects) {
            if (project.getAssets().isEmpty()) {
                toBeRemoved.add(project);
            }
        }
        return toBeRemoved;
    }

    protected void placeAssetInCorrectProject(List<Project> sogrProjects, Asset asset, int year, ProjectType projectType) {
        //make sure we are only looking at projects with the correct type
        List<Project> reducedSogrProjects = sogrProjects.stream().filter(p -> projectType.equals(p.projectType)).toList();

        boolean assetInProject = false;
        for (Project project : reducedSogrProjects) {
            List<Asset> assets = project.getAssets();
            if (assets.contains(asset)) {//already in project
                if (project.fiscalYear.intValue() != year)
                    project.removeAsset(asset);//but shouldn't be since year is not correct
                else assetInProject = true;//and should stay there
            }
            else if (project.fiscalYear.intValue() == year &&
                    project.ownerOrganization.equals(asset.orgKey) &&
                    (assets.size() == 0 || asset.assetTypeKey.equals(project.assetTypeKey()))) {//asset not in project but should be so add
                project.addAsset(asset);
                assetInProject = true;
            }
        }

        if (!assetInProject) {//asset needs new project since none of existing projects were a match
            Project newProject = new Project();
            newProject.addAsset(asset);
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
