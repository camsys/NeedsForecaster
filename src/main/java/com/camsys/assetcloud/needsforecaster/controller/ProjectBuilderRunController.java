package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectBuilderRunRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ProjectBuilderRunController {
    private final ProjectBuilderRunRepository runRepository;

    public ProjectBuilderRunController(ProjectBuilderRunRepository runRepository) {
        this.runRepository = runRepository;
    }

    //get relevant fiscal years for a project builder
    @GetMapping(value = "/api/runs/fiscal-years", produces = "application/json")
    public List<Integer> getFiscalYears() {
        //TODO - need to figure out which years should be offered.
        List<Integer> fiscalYears = new ArrayList<>();
        fiscalYears.add(2026);
        fiscalYears.add(2027);
        fiscalYears.add(2028);
        fiscalYears.add(2029);
        fiscalYears.add(2030);
        fiscalYears.add(2031);
        fiscalYears.add(2032);
        fiscalYears.add(2033);
        fiscalYears.add(2034);
        fiscalYears.add(2035);
        return fiscalYears;//temporary list for UI use
    }

    //get relevant fiscal years for a project builder
    @GetMapping(value = "/api/runs/range-years", produces = "application/json")
    public List<Integer> getRanges() {
        //TODO - need to figure out which ranges should be offered.
        List<Integer> yearRanges = new ArrayList<>();
        yearRanges.add(5);
        yearRanges.add(10);
        yearRanges.add(15);
        yearRanges.add(20);
        yearRanges.add(25);
        yearRanges.add(50);
        return yearRanges;//temporary list for UI use
    }

    @GetMapping(value = "/api/runs", produces = "application/json")
    public List<ProjectBuilderRun> getRuns() {
        return runRepository.list();
    }

//    @PostMapping(value = "/api/runs/new", consumes = "application/json", produces = "application/json")
//    public ProjectBuilderRun runBuilder(@RequestBody(required = true) ProjectBuilderRun params) {
//
//        return builderService.run(params);
//    }
}
