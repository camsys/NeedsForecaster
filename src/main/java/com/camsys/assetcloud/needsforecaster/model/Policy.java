package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    public String name;

    @NotNull
    public String description;

    @NotNull
    public String ownerOrganization;

    @OneToMany(mappedBy = "policy")
    public List<PolicyRule> rules;
}
