package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotNull
    public String name;

    @NotNull
    public String description;

    @NotNull
    public String ownerOrganization;

    @NotNull
    public Integer fiscalYear;

    @NotNull
    public String projectType;

    public boolean sogr;

    //will be empty for non-sogr projects
    @ManyToMany
    public List<Asset> assets;

    public String assetTypeKey() {
        if (assets == null || assets.size() == 0) return null;
        else return assets.get(0).assetTypeKey;
    }

    public boolean isValid() {
        if (name == null || name.isEmpty()) {return false;}
        if (description == null || description.isEmpty()) {return false;}
        if (ownerOrganization == null || ownerOrganization.isEmpty()) {return false;}
        if (projectType == null || projectType.isEmpty()) {return false;}
        if (fiscalYear == null || fiscalYear < 2000) {return false;}
        return true;
    }

    @Override
    public String toString() {
        return ownerOrganization + ": " + name;
    }
}
