package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    //uniquely identifies the asset in Asset Inventory - need for all communication with that module
    @NotNull
    public String uniqueKey;

    @NotNull
    public String assetId;//user understood id for asset

    @NotNull
    public String orgKey;

    @NotNull
    public String assetTypeKey;

    @NotNull
    public String assetSubTypeKey;

    @NotNull
    public LocalDate inServiceDate;

    public String condition;

    public Integer odometer;

    public String vin;

    public String description;

    public String name;

    public Integer policyReplacementYear;

    public void update (Asset asset) {
        if (this.uniqueKey == null || !this.uniqueKey.equals(asset.uniqueKey))
            throw new IllegalArgumentException("to update, the unique keys must be the same");

        this.assetId = asset.assetId;
        this.orgKey = asset.orgKey;
        this.assetTypeKey = asset.assetTypeKey;
        this.assetSubTypeKey = asset.assetSubTypeKey;
        this.inServiceDate = asset.inServiceDate;
        this.condition = asset.condition;
        this.odometer = asset.odometer;
        this.vin = asset.vin;
        this.description = asset.description;
        this.name = asset.name;
        this.policyReplacementYear = asset.policyReplacementYear;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Asset asset = (Asset) o;

        if (uniqueKey == null) return false;
        return uniqueKey.equals(asset.uniqueKey);//if unique key's exist and are the same they are equal
    }

    @Override
    public String toString() {
        return assetId + ":" + orgKey + ":" + assetTypeKey + ":" + assetSubTypeKey;
    }

}
