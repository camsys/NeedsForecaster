package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.model.Organization;
import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
public class PoliciesController {

    @Autowired
    private PolicyRepository policyRepository;

    @GetMapping(value = "/orgs", produces = "application/json")
    public List<Organization> getAllOrganizations() {
        //TBD call AI API to get list of current orgs (use same model class from AssetCloud Core)
        WebClient client = WebClient.create(/*put asset inventory base domain here*/);//TBD
        List<Organization> organizations = new ArrayList<>();//TBD

        return organizations;//TBD
    }

    @GetMapping(value = "/policies", produces = "application/json")
    public List<Policy> getAllPoliciesByOrganization(@RequestParam(value = "orgKey") String organizationKey) {
        return policyRepository.findByOrg(organizationKey);
    }

    @GetMapping(value = "/policies/{id}", produces = "application/json")
    public Optional<Policy> getPolicyById(@PathVariable(value = "id") Long policyId) {
        return policyRepository.findById(policyId);
    }
}
