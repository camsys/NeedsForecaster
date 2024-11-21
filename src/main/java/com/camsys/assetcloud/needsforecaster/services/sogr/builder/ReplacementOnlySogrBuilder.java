package com.camsys.assetcloud.needsforecaster.services.sogr.builder;

import com.camsys.assetcloud.needsforecaster.model.*;
import com.camsys.assetcloud.needsforecaster.model.enums.ProjectType;
import com.camsys.assetcloud.needsforecaster.repositories.*;
import com.camsys.assetcloud.needsforecaster.services.Utility;
import com.camsys.assetcloud.needsforecaster.services.external.AssetInventoryService;
import com.camsys.assetcloud.needsforecaster.services.sogr.calculators.ReplacementYearPolicyApplication;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReplacementOnlySogrBuilder extends SogrBuilderBase implements SogrBuilder {

    private final ProjectRepository projectRepository;
    private final AssetInventoryService aiService;
    private final ReplacementYearPolicyApplication replacementYearPolicyApplication;
    private final PolicyRepository policyRepository;
    private final AssetRepository assetRepository;


    public ReplacementOnlySogrBuilder(@Qualifier("mockAIService") AssetInventoryService aiService,
                                      ProjectRepository projectRepository,
                                      ReplacementYearPolicyApplication replacementYearPolicyApplication,
                                      PolicyRepository policyRepository,
                                      AssetRepository assetRepository) {
        this.projectRepository = projectRepository;
        this.aiService = aiService;
        this.replacementYearPolicyApplication = replacementYearPolicyApplication;
        this.policyRepository = policyRepository;
        this.assetRepository = assetRepository;
    }

    @Override
    public void build(ProjectBuilderRun run) {
        //get all relevant assets
        List<Asset> activeAssets = aiService.getActiveAssets(run.ownerOrganization, run.assetTypeKeys);

        //get all current sogr projects for org requested in run
        ProjectFilter filter = new ProjectFilter();
        filter.ownerOrganization = run.ownerOrganization;
        filter.sogr = true;
        List<Project> sogrProjects = projectRepository.findByFilter(filter);

        List<Asset> disposedAssets = determineDisposedAssets(run.assetTypeKeys, sogrProjects, activeAssets);

        //process active assets and see if they should be in projects
        Policy policy = getCurrentPolicy(run.ownerOrganization);

        Integer startYear = run.fiscalYear;
        Integer endYear = run.fiscalYear + run.yearRange;
        for (Asset asset : activeAssets) {
            //update all policy replacement years for assets
            replacementYearPolicyApplication.apply(policy, asset);

            //calc min allowed year
            int minAllowedYear = Math.max(Utility.getCurrentFiscalYear() + 1, asset.policyReplacementYear);

            //place project if in range
            if (minAllowedYear >= startYear && minAllowedYear <= endYear) {
                Asset a = assetRepository.findByUniqueKey(asset.uniqueKey);
                if (a == null){//asset not in db yet
                    a = assetRepository.save(asset);
                }
                else {
                    a.update(asset);//update asset and save
                    assetRepository.save(a);
                }
                placeAssetInCorrectProject(sogrProjects, a, minAllowedYear, ProjectType.Replacement);
            }
            //else ignore asset since it is not relevant to requested build years
        }

        List<Project> toBeRemoved = findEmptyProjects(sogrProjects);

        //save updated project list
        sogrProjects.removeAll(toBeRemoved);
        projectRepository.deleteAll(toBeRemoved);

        //remove disposed assets from projects
        sogrProjects.forEach(project -> project.removeAssets(disposedAssets));

        //save projects
        projectRepository.saveAll(sogrProjects);

        //delete disposed assets from NF database
        assetRepository.deleteAll(disposedAssets);

        //call Asset Inventory API to update policy replacement years on assets
        aiService.broadcastAssetUpdates(activeAssets);


        //artificially add some time to the job
        try {
            Thread.sleep(10000);//simulate run work
        } catch (InterruptedException e) { e.printStackTrace();}

    }

    //TODO: MVP assumes one policy in system that everyone uses
    public Policy getCurrentPolicy(String orgKey) {
        return policyRepository.list().get(0);
    }

}
