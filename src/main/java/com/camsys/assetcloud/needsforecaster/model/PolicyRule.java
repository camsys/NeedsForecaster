package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
public class PolicyRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    public String assetTypeKey;

    @NotNull
    public String serviceLifeCalculationMethod;

    @NotNull
    public Date createdOn;

    @NotNull
    public Date updatedOn;

    @NotNull
    @ManyToOne
    public Policy policy;

    @OneToMany(mappedBy = "policyRule")
    public List<PolicySubRule> subRules;

}
