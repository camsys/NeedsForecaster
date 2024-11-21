package com.camsys.assetcloud.needsforecaster.services.sogr.calculators;

import java.time.LocalDate;
import java.util.Calendar;

public abstract class ServiceLifeCalculatorBase  {
    public static final String AGE_ONLY = "Age Only";
    public static final String AGE_AND_MILEAGE = "Age and Mileage";

    //gets resulting date when adding months
    protected LocalDate addMonths(LocalDate initialDate, int months) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(initialDate.getYear(), initialDate.getMonthValue(), initialDate.getDayOfMonth());
        calendar.add(Calendar.MONTH, months);
        return LocalDate.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH));
    }

    protected int getCurrentYear() {
        return LocalDate.now().getYear();
    }
}
