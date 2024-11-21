package com.camsys.assetcloud.needsforecaster.model;

import com.camsys.assetcloud.needsforecaster.model.enums.ProjectType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collections;
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
    @Enumerated(EnumType.STRING)
    public ProjectType projectType;

    public boolean sogr;

    //will be empty for non-sogr projects
    @ManyToMany
    protected List<Asset> assets;

    public List<Asset> getAssets() {
        return Collections.unmodifiableList(assets);
    }

    //works under the assumption that all assets for a project have the same asset type
    public String assetTypeKey() {
        if (assets == null || assets.size() == 0) return null;
        else return assets.get(0).assetTypeKey;
    }

    public boolean addAsset(Asset asset) {
        //only add if asset type matches existing assets or list is empty
        String assetTypeKey = assetTypeKey();
        if (assetTypeKey == null || assetTypeKey.equals(asset.assetTypeKey)) {
            if (assets == null) assets = new ArrayList<>();
            return assets.add(asset);
        }
        //else do not add
        return false;
    }

    public boolean removeAsset(Asset asset) {
        if (asset == null) return false;
        return assets.remove(asset);
    }

    public boolean removeAssets(List<Asset> disposedAssets) {
        if (assets == null) return false;
        return assets.removeAll(disposedAssets);
    }

    public boolean isValid() {
        if (name == null || name.isEmpty()) {return false;}
        if (description == null || description.isEmpty()) {return false;}
        if (ownerOrganization == null || ownerOrganization.isEmpty()) {return false;}
        if (projectType == null) {return false;}
        if (fiscalYear == null || fiscalYear < 2000) {return false;}
        return true;
    }

    @Override
    public String toString() {
        return ownerOrganization + ": " + name;
    }
}
