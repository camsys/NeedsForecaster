package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.Policy;
import com.camsys.assetcloud.needsforecaster.model.PolicyListDTO;
import com.camsys.assetcloud.needsforecaster.repositories.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
public class PoliciesController {

    @Autowired
    private PolicyRepository policyRepository;

    private List<Policy> policies = new ArrayList<>();

    //temporary constructor to create mock data
    public PoliciesController() {
        //temporary
        policies.clear();
        Policy policy = new Policy();
        policy.name = "FY 2017 Statewide Transit Policy (Current)";
        policy.description = "Main policy";
        policy.id = Long.parseLong("1");
        policy.ownerOrganization = "bpt";
        policies.add(policy);

        policy = new Policy();
        policy.name = "FY 2016 Statewide Transit Policy";
        policy.description = "alternate policy";
        policy.id = Long.parseLong("2");
        policy.ownerOrganization = "bpt";
        policies.add(policy);

        policy = new Policy();
        policy.name = "FY 2015 Statewide Transit Policy";
        policy.description = "third policy option";
        policy.id = Long.parseLong("3");
        policy.ownerOrganization = "bpt";
        policies.add(policy);

        policy = new Policy();
        policy.name = "Another Transit Policy for 2";
        policy.description = "another policy description";
        policy.id = Long.parseLong("4");
        policy.ownerOrganization = "org2";
        policies.add(policy);

        policy = new Policy();
        policy.name = "Another Transit Policy for 3";
        policy.description = "another policy description";
        policy.id = Long.parseLong("5");
        policy.ownerOrganization = "org3";
        policies.add(policy);
    }

    @GetMapping(value = "/api/policies/list", produces = "application/json")
    public List<PolicyListDTO> listPoliciesByOrganization(@RequestParam(required = false, value = "orgKey") String organizationKey) {
        return policies.stream().filter(p -> organizationKey == null || p.ownerOrganization.equals(organizationKey)).map(p -> new PolicyListDTO(p)).collect(Collectors.toList());//return mocked data
        //return policyRepository.findByOrg(organizationKey).stream().map(p -> new PolicyListDTO(p)).collect(Collectors.toList());
    }

    @GetMapping(value = "/api/policies/{id}", produces = "application/json")
    public Optional<Policy> getPolicyById(@PathVariable(value = "id") Long policyId) {
        return policies.stream().filter(p -> p.id == policyId).findFirst();//search mocked data
        //return policyRepository.findById(policyId);
    }

    //commenting out as this is not yet available
    //@PostMapping(value = "/api/policy/edit", consumes="application/json", produces="application/json")
    public Policy editPolicy(@RequestBody Policy policy) {
        Optional<Policy> savedPolicy;
        try {
            //fetch saved policy
            savedPolicy = getPolicyById(policy.id);

            if (savedPolicy.isPresent()) {
                //see if the description field has changed
                if (policy.description != null && !savedPolicy.get().description.equals(policy.description) ) {
                    savedPolicy.get().description = policy.description;
                    return policyRepository.save(savedPolicy.get());
                }
                else return savedPolicy.get();
            }
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
        //TODO: need error handling in response/catch
    }
}
