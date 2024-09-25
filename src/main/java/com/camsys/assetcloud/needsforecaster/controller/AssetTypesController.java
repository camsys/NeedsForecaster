package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.AssetType;
import com.camsys.assetcloud.needsforecaster.model.Org;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AssetTypesController {
    @GetMapping(value = "/api/asset-types/list", produces = "application/json")
    public List<AssetType> listAssetTypes() {
        //TBD call AI API to get list of current asset types?
        //WebClient client = WebClient.create(/*put asset inventory base domain here*/);//TBD
        List<AssetType> types = new ArrayList<>();//TBD

        //temporary
        AssetType type = new AssetType();
        type.key = "admin";
        type.name = "Administration";
        types.add(type);
        type = new AssetType();
        type.key = "buses";
        type.name = "Buses (Rubber Tire Vehicles)";
        types.add(type);
        type = new AssetType();
        type.key = "capital_equip";
        type.name = "Capital Equipment";
        types.add(type);
        type = new AssetType();
        type.key = "ferries";
        type.name = "Ferries";
        types.add(type);
        type = new AssetType();
        type.key = "maintenance";
        type.name = "Maintenance";
        types.add(type);
        type = new AssetType();
        type.key = "other_passenger_veh";
        type.name = "Other Passenger Vehicles";
        types.add(type);
        type = new AssetType();
        type.key = "parking";
        type.name = "Parking";
        types.add(type);
        type = new AssetType();
        type.key = "rail_cars";
        type.name = "Rail Cars";
        types.add(type);
        type = new AssetType();
        type.key = "service_veh_nonrev";
        type.name = "Service Vehicles (Non-Revenue)";
        types.add(type);

        return types;//TBD
    }
}
