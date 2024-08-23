package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.Org;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class OrgsController {

    @GetMapping(value = "/api/orgs/list", produces = "application/json")
    public List<Org> listOrgs() {
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
}
