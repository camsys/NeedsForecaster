package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.model.Project;
import com.camsys.assetcloud.needsforecaster.model.ProjectFilter;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProjectsController {

    private final ProjectRepository projectRepository;

    public ProjectsController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    //get relevant fiscal years for a project filter
    @GetMapping(value = "/api/projects/fiscal-years", produces = "application/json")
    public List<String> getFiscalYears() {
        //TODO - need to figure out which years should be offered.  Maybe just the ones which projects already?
        List<String> fiscalYears = new ArrayList<>();
        fiscalYears.add("FY2023");
        fiscalYears.add("FY2024");
        fiscalYears.add("FY2025");
        fiscalYears.add("FY2026");
        fiscalYears.add("FY2027");
        fiscalYears.add("FY2028");
        return fiscalYears;//temporary list for UI use
    }

    @PostMapping(value = "/api/projects", produces = "application/json")
    public List<Project> getProjects(@RequestBody(required = false) ProjectFilter filter) {
        if (filter == null)//no filter provided so return full list
            return projectRepository.list();
        else {
            return projectRepository.findByFilter(filter);
        }
    }
}
