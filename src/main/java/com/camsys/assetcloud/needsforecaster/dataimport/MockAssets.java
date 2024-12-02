package com.camsys.assetcloud.needsforecaster.dataimport;

import com.camsys.assetcloud.needsforecaster.model.Asset;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class MockAssets {

    public List<Asset> load() throws IOException {
        List<Asset> assets = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("M/d/yy");

        Reader assetIn = new FileReader("./data/MockAssets.csv");
        Iterable<CSVRecord> assetRecords = CSVFormat.RFC4180.builder()
                .setHeader("UniqueKey","AssetId","OrgKey","AssetType","AssetSubType","InServiceDate","Condition","Odometer","Vin","Description","Name")
                .setSkipHeaderRecord(true)
                .build()
                .parse(assetIn);

        for (CSVRecord aRecord : assetRecords) {
            Asset asset = new Asset();
            asset.uniqueKey = aRecord.get("UniqueKey");
            asset.assetId = aRecord.get("AssetId");
            asset.orgKey = aRecord.get("OrgKey");
            asset.assetTypeKey = aRecord.get("AssetType");
            asset.assetSubTypeKey = aRecord.get("AssetSubType");
            asset.inServiceDate = LocalDate.parse(aRecord.get("InServiceDate"), formatter);
            asset.condition = aRecord.get("Condition");
            String csvOdometer = aRecord.get("Odometer");
            asset.odometer = csvOdometer == null || csvOdometer.isEmpty() ? null : Integer.parseInt(csvOdometer);
            asset.vin = aRecord.get("Vin");
            asset.description = aRecord.get("Description");
            asset.name = aRecord.get("Name");


            assets.add(asset);
        }
        return assets;
    }
}
