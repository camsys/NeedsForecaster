package com.camsys.assetcloud.needsforecaster.model;

public class PolicyListDTO {

    private Policy policy;
    public PolicyListDTO(Policy policy) {
        this.policy = policy;
    }

    public Long getId() { return policy.id; };

    public String getName() { return policy.name; };

    public String getDescription() { return policy.description; };

    public String getOwnerOrganization() { return policy.ownerOrganization; };
}
