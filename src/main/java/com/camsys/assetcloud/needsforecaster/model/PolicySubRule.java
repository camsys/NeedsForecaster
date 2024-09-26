package com.camsys.assetcloud.needsforecaster.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class PolicySubRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @JsonIgnore
    @NotNull
    @ManyToOne
    public PolicyRule policyRule;

    @NotNull
    public String assetSubType;

    public int eslMonths;

    public int eslMiles;
}
