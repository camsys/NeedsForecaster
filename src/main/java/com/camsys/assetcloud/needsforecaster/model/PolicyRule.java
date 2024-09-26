package com.camsys.assetcloud.needsforecaster.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    public String assetType;

    @NotNull
    public String serviceLifeCalculationMethod;

    @NotNull
    public Date createdOn;

    @NotNull
    public Date updatedOn;

    @JsonIgnore
    @NotNull
    @ManyToOne
    public Policy policy;

    @OneToMany(mappedBy = "policyRule")
    public List<PolicySubRule> subRules;

}
