package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.AssetType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AssetTypesController {
    @GetMapping(value = "/api/asset-types", produces = "application/json")
    public List<AssetType> listAssetTypes() {
        //TBD call AI API to get list of current asset types?
        //WebClient client = WebClient.create(/*put asset inventory base domain here*/);//TBD
        List<AssetType> types = new ArrayList<>();//TBD

        //temporary
        AssetType type = new AssetType();
        type.key = "Administration";
        type.name = "Administration";
        types.add(type);
        type = new AssetType();
        type.key = "Buses (Rubber Tire Vehicles)";
        type.name = "Buses (Rubber Tire Vehicles)";
        types.add(type);
        type = new AssetType();
        type.key = "Capital Equipment";
        type.name = "Capital Equipment";
        types.add(type);
        type = new AssetType();
        type.key = "Ferries";
        type.name = "Ferries";
        types.add(type);
        type = new AssetType();
        type.key = "Maintenance";
        type.name = "Maintenance";
        types.add(type);
        type = new AssetType();
        type.key = "Other Passenger Vehicles";
        type.name = "Other Passenger Vehicles";
        types.add(type);
        type = new AssetType();
        type.key = "Parking";
        type.name = "Parking";
        types.add(type);
        type = new AssetType();
        type.key = "Rail_cars";
        type.name = "Rail Cars";
        types.add(type);
        type = new AssetType();
        type.key = "Service Vehicles (Non-Revenue)";
        type.name = "Service Vehicles (Non-Revenue)";
        types.add(type);

        return types;//TBD
    }
}
