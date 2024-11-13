package com.camsys.assetcloud.needsforecaster.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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


}
