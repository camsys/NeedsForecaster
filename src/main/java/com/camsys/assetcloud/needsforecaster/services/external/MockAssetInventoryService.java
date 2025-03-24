package com.camsys.assetcloud.needsforecaster.services.external;

import com.camsys.assetcloud.needsforecaster.dataimport.MockAssets;
import com.camsys.assetcloud.needsforecaster.model.Asset;
import com.camsys.assetcloud.needsforecaster.model.Org;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service("mockAIService")
public class MockAssetInventoryService implements AssetInventoryService {

    private MockAssets mockAssets;

    public MockAssetInventoryService(MockAssets mockAssets) {
        this.mockAssets = mockAssets;
    }

    @Override
    public List<Org> getOrgs() {
        //TBD call AI API to get list of current organizations (use same model class from AssetCloud Core?)
        //WebClient client = WebClient.create(/*put asset inventory base domain here*/);//TBD
        List<Org> organizations = new ArrayList<>();//TBD

        //temporary
        Org organization = new Org();
        organization.name = "BPT-PennDOT Bureau of Public Transportation";
        organization.orgKey = "bpt";
        organizations.add(organization);
        organization = new Org();
        organization.name = "Organization 2";
        organization.orgKey = "org2";
        organizations.add(organization);
        organization = new Org();
        organization.name = "Organization 3";
        organization.orgKey = "org3";
        organizations.add(organization);

        return organizations;//TBD
    }

    @Override
    public List<Asset> getActiveAssets(String orgKey, List<String> assetTypeKeys) throws Exception {
        List<Asset> allAssets = mockAssets.load();
        return allAssets.stream().filter(a -> a.orgKey.equals(orgKey) && assetTypeKeys.contains(a.assetTypeKey)).toList();
    }

    @Override
    public void broadcastAssetUpdates(List<Asset> assets) {
        System.out.println("Broadcast asset updates (size: " + assets.size() + ")");
    }

    @Override
    public void setServer(String callingServerName) {

    }

    @Override
    public void setToken(String token) {

    }
}
