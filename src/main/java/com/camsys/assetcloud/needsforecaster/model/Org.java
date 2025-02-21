package com.camsys.assetcloud.needsforecaster.model;

import com.camsys.assetcloud.model.Organization;

public class Org extends Organization {
    public String orgKey;

    @Override
    public String toString() {
        return String.format("%s : %s", orgKey, name);
    }
}
