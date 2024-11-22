package com.camsys.assetcloud.needsforecaster.services;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class Utility {
    public static Integer getFiscalYear(LocalDate date) {
        //TODO: implement actual logic to calculate the fiscal year the given date is associated with - for now just assume fiscal year is the calendar year
        return date.getYear();
    }

    public static Integer getCurrentFiscalYear() {
        return getFiscalYear(LocalDate.now());
    }
}
