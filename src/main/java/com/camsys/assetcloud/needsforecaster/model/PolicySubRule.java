package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
public class PolicySubRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    @ManyToOne
    public PolicyRule policyRule;

    @NotNull
    public String assetSubType;

    @NotNull
    public boolean isCustom;//if true, allows edit and deleting

    public int eslMonths;

    public int eslMiles;

    //check to see if this new subrule has all the required fields
    public boolean validate() {
        if (policyRule == null) return false;
        if (policyRule.id == 0) return false;
        if (assetSubType == null) return false;
        return !assetSubType.isEmpty();
    }
}
