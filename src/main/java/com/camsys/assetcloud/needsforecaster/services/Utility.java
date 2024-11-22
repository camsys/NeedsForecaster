package com.camsys.assetcloud.needsforecaster.services;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;

@Service
public class Utility {
    public static Integer getFiscalYear(LocalDate date) {
        //using July 1 as start of a fiscal year
        int dateYear = date.getYear();
        Month dateMonth = date.getMonth();
        if (Month.JULY.compareTo(dateMonth) > 0) {//JULY greater than date month
            return dateYear;//date is before July 1 so use current calendar year
        }
        else return dateYear + 1;//use next calendar year as the fiscal year for this date
    }

    public static Integer getCurrentFiscalYear() {
        return getFiscalYear(LocalDate.now());
    }
}
