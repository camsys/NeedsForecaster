package com.camsys.assetcloud.needsforecaster.services.sogr;

import com.camsys.assetcloud.needsforecaster.model.Project;
import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunStatus;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectBuilderRunRepository;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectRepository;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;
import com.camsys.assetcloud.needsforecaster.services.sogr.runner.RunnerCallback;
import com.camsys.assetcloud.needsforecaster.services.sogr.runner.SogrRunner;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SogrProjectManager {
    private final ProjectBuilderRunRepository projectBuilderRunRepository;
    private final ProjectRepository projectRepository;
    private final SogrBuilder builder;
    private final SogrRunner runner;

    public SogrProjectManager(ProjectBuilderRunRepository projectBuilderRunRepository,
                              ProjectRepository projectRepository,
                              SogrBuilder builder,
                              SogrRunner runner) {
        this.projectBuilderRunRepository = projectBuilderRunRepository;
        this.projectRepository = projectRepository;
        this.builder = builder;
        this.runner = runner;
    }

    public ProjectBuilderRun create(ProjectBuilderRun newRun) {
        if (newRun == null) throw new IllegalArgumentException("'run' arg cannot be null");

        //create run
        newRun.runKey = ProjectBuilderRun.generateSogrRunKey();
        newRun.createdOn = new Date();
        newRun.status = ProjectBuilderRunStatus.WAITING;
        newRun = projectBuilderRunRepository.save(newRun);

        //add new run to the task queue
        runner.run(newRun, builder, new RunnerCallback() {
            @Override
            public void callbackBegin(Long runId) {
                ProjectBuilderRun run = projectBuilderRunRepository.findById(runId).orElseThrow();
                run.status = ProjectBuilderRunStatus.PROCESSING;
                run.completeOn = new Date();
                projectBuilderRunRepository.save(run);
            }

            @Override
            public void callbackComplete(Long runId) {
                //update all runs project count value
                List<ProjectBuilderRun> runs = projectBuilderRunRepository.list();
                runs.forEach(r -> projectBuilderRunRepository.updateRunProjectCount(r));

                ProjectBuilderRun run = projectBuilderRunRepository.findById(runId).orElseThrow();
                run.status = ProjectBuilderRunStatus.COMPLETE;
                run.completeOn = new Date();
                projectBuilderRunRepository.save(run);
            }

            @Override
            public void callbackError(Long runId) {
                ProjectBuilderRun run = projectBuilderRunRepository.findById(runId).orElseThrow();
                run.status = ProjectBuilderRunStatus.ERROR;
                projectBuilderRunRepository.save(run);
            }
        });

        return newRun;
    }

    public List<Project> getProjectsByRunId(Long runId) {
        ProjectBuilderRun run = projectBuilderRunRepository.findById(runId).orElseThrow();

        return projectRepository.findByRun(run);
    }

}
