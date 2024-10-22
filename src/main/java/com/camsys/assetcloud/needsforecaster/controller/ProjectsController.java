package com.camsys.assetcloud.needsforecaster.controller;

import com.camsys.assetcloud.needsforecaster.controller.exceptions.EntityNotFoundException;
import com.camsys.assetcloud.needsforecaster.model.Project;
import com.camsys.assetcloud.needsforecaster.model.ProjectFilter;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ProjectsController {

    private final ProjectRepository projectRepository;

    public ProjectsController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    //get relevant fiscal years for a project filter
    @GetMapping(value = "/api/projects/fiscal-years", produces = "application/json")
    public List<Integer> getFiscalYears() {
        //TODO - need to figure out which years should be offered.  Maybe just the ones which projects already?
        List<Integer> fiscalYears = new ArrayList<>();
        fiscalYears.add(2023);
        fiscalYears.add(2024);
        fiscalYears.add(2025);
        fiscalYears.add(2026);
        fiscalYears.add(2027);
        fiscalYears.add(2028);
        return fiscalYears;//temporary list for UI use
    }

    @PostMapping(value = "/api/projects", consumes = "application/json", produces = "application/json")
    public List<Project> getProjects(@RequestBody(required = false) ProjectFilter filter) {
        if (filter == null)//no filter provided so return full list
            return projectRepository.list();
        else {
            return projectRepository.findByFilter(filter);
        }
    }

    @PostMapping(value = "/api/projects/new", consumes = "application/json", produces = "application/json")
    public Project addProject(@RequestBody Project project) {
        if (!project.manual) {
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
        projectRepository.findById(projectId).map(toBeDeletedProject -> {
            //can only delete manual projects
            if (!toBeDeletedProject.manual) {
                throw new IllegalArgumentException("Project must be manual to edit with this API call");
            }
            return toBeDeletedProject;
        }).orElseThrow(() -> new EntityNotFoundException("Project", projectId));

        //if made it this far, then delete the project
        projectRepository.deleteById(projectId);
    }

    @PutMapping(value = "/api/projects/{id}", consumes = "application/json", produces = "application/json")
    public Project editProject(@PathVariable(value="id") Long projectId, @RequestBody Project project) {

        return projectRepository.findById(projectId).map(toBeEditedProject -> {
                    //can only edit manual projects
                    if (!toBeEditedProject.manual) {
                        throw new IllegalArgumentException("Project must be manual to edit with this API call");
                    }

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
                    if (project.fiscalYear != null && !toBeEditedProject.fiscalYear.equals(project.fiscalYear)) {
                        toBeEditedProject.fiscalYear = project.fiscalYear;
                        hasChanged = true;
                    }
                    if (project.projectType != null && !toBeEditedProject.projectType.equals(project.projectType)) {
                        toBeEditedProject.projectType = project.projectType;
                        hasChanged = true;
                    }


                    if (hasChanged) {
                        return projectRepository.save(toBeEditedProject);
                    }
                    return toBeEditedProject;
                })
                .orElseThrow(() -> new EntityNotFoundException("Project", projectId));
    }
}
