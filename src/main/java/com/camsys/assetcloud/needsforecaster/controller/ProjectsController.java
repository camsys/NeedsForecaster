package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.controller.exceptions.EntityNotFoundException;
import com.camsys.assetcloud.needsforecaster.model.*;
import com.camsys.assetcloud.needsforecaster.model.enums.ProjectType;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectRepository;
import com.camsys.assetcloud.needsforecaster.services.sogr.SogrProjectManager;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProjectsController {

    private final ProjectRepository projectRepository;
    private final SogrProjectManager sogrProjectManager;

    public ProjectsController(ProjectRepository projectRepository, SogrProjectManager sogrProjectManager) {
        this.projectRepository = projectRepository;
        this.sogrProjectManager = sogrProjectManager;
    }

    //get relevant fiscal years for a project filter
    @GetMapping(value = "/api/projects/fiscal-years", produces = "application/json")
    public List<Integer> getFiscalYears() {
        //return all years between current year and max fiscal year on an existing project
        Integer maxFiscalYear = projectRepository.getMaxProjectFiscalYear();
        Calendar calendar = Calendar.getInstance();
        Integer currentYear = calendar.get(Calendar.YEAR);

        //make sure there are at least 10 years in list
        maxFiscalYear = Math.max(currentYear + 9, maxFiscalYear);

        List<Integer> fiscalYears = new ArrayList<>();
        for (Integer year = currentYear; year <= maxFiscalYear; year++) {
            fiscalYears.add(year);
        }
        return fiscalYears;
    }

    //get relevant project types for a project filter
    @GetMapping(value = "/api/projects/types", produces = "application/json")
    public List<ProjectType> getProjectTypes() {
        List<ProjectType> projTypes = new ArrayList<>();
        projTypes.add(ProjectType.Replacement);
        projTypes.add(ProjectType.Expansion);
        projTypes.add(ProjectType.Improvement);
        projTypes.add(ProjectType.Demonstration);
        return projTypes;//temporary list for UI use
    }

    @GetMapping(value = "/api/projects/{id}", produces = "application/json")
    public Project getProjectById(@PathVariable(value = "id") Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project", projectId));
    }

    @PostMapping(value = "/api/projects", consumes = "application/json", produces = "application/json")
    public List<ProjectListDTO> getProjects(@RequestBody(required = false) ProjectFilter filter, @RequestParam(required = false) Long runId) {
        if (runId != null && runId > 0) {//shortcut filter used via ProjectBuildRun
            return sogrProjectManager.getProjectsByRunId(runId).stream().map(ProjectListDTO::new).collect(Collectors.toList());
        }

        //otherwise, check for basic filter
        if (filter == null)//no filter provided so return full list
            return projectRepository.list().stream().map(ProjectListDTO::new).collect(Collectors.toList());
        else {
            return projectRepository.findByFilter(filter).stream().map(ProjectListDTO::new).collect(Collectors.toList());
        }
    }

    @PostMapping(value = "/api/projects/new", consumes = "application/json", produces = "application/json")
    public Project addProject(@RequestBody Project project) {
        if (project.sogr) {
            throw new IllegalArgumentException("Project must be manual to add with this API call");
        }

        if (project.isValid()) {
            return projectRepository.save(project);
        }
        else {
            throw new IllegalArgumentException("Invalid project: "+ project);
        }
    }

    @DeleteMapping(value ="/api/projects/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable(name="id") Long projectId) {

        projectRepository.deleteById(projectId);//will silently fail if project does not exist
    }

    @PutMapping(value = "/api/projects/{id}", consumes = "application/json", produces = "application/json")
    public Project editProject(@PathVariable(value="id") Long projectId, @RequestBody Project project) {

        return projectRepository.findById(projectId).map(toBeEditedProject -> {

                    //check what data has changed
                    boolean hasChanged = false;
                    if (project.name != null && !toBeEditedProject.name.equals(project.name)) {
                        toBeEditedProject.name = project.name;
                        hasChanged = true;
                    }
                    if (project.description != null && !toBeEditedProject.description.equals(project.description)) {
                        toBeEditedProject.description = project.description;
                        hasChanged = true;
                    }

                    //type and fiscal year can only be edited for manual projects
                    if (!toBeEditedProject.sogr) {
                        if (project.fiscalYear != null && !toBeEditedProject.fiscalYear.equals(project.fiscalYear)) {
                            toBeEditedProject.fiscalYear = project.fiscalYear;
                            hasChanged = true;
                        }
                        if (project.projectType != null && !toBeEditedProject.projectType.equals(project.projectType)) {
                            toBeEditedProject.projectType = project.projectType;
                            hasChanged = true;
                        }
                    }


                    if (hasChanged) {
                        return projectRepository.save(toBeEditedProject);
                    }
                    return toBeEditedProject;
                })
                .orElseThrow(() -> new EntityNotFoundException("Project", projectId));
    }
}
