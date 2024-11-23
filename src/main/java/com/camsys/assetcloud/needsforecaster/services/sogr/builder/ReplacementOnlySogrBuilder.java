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
    public boolean build(ProjectBuilderRun run) {
        //artificially add some time to the beginning of the build
        try {
            Thread.sleep(10000);//simulate run work
        } catch (InterruptedException e) { e.printStackTrace();}

        //get all relevant assets
        List<Asset> activeAssets = null;
        try {
            activeAssets = aiService.getActiveAssets(run.ownerOrganization, run.assetTypeKeys);
        }
        catch (Exception ex) {
            System.err.println(ex.getMessage());
            return false;//something went wrong - in this case, the asset import
        }

        if (activeAssets == null) {
            return false;//something went wrong so don't assume all assets are disposed
        }

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
            try {
                replacementYearPolicyApplication.apply(policy, asset);
            } catch (Exception e) {
                System.err.println("Replacement policy application error: policyId=" + policy.id + ", asset=" + asset.toString());
                throw e;
            }

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
        try {
            aiService.broadcastAssetUpdates(activeAssets);
        } catch (Exception ex) {
            //swallow any exception here since we don't want to undo the whole transaction just because we couldn't broadcast successfully
            ex.printStackTrace();
        }

        //artificially add some time to the end of the build
        try {
            Thread.sleep(10000);//simulate run work
        } catch (InterruptedException e) { e.printStackTrace();}

        return true;//build was successful
    }

    //TODO: MVP assumes one policy in system that everyone uses
    @Override
    public Policy getCurrentPolicy(String orgKey) {
        return policyRepository.list().get(0);
    }

}
