package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import java.time.LocalDate;
import java.util.Calendar;

public abstract class ServiceLifeCalculatorBase  {
    public static final String AGE_ONLY = "Age Only";
    public static final String AGE_AND_MILEAGE = "Age and Mileage";

    //gets resulting date when adding months
    protected LocalDate addMonths(LocalDate initialDate, int months) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(initialDate.getYear(), initialDate.getMonthValue() - 1, initialDate.getDayOfMonth());//move from local date 1-12 months to calendar 0-11 months
        calendar.add(Calendar.MONTH, months);
        return LocalDate.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH));//move back to local date 1-12 months
    }
}
