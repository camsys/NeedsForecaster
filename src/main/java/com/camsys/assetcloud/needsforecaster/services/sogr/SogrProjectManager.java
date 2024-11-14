package com.camsys.assetcloud.needsforecaster.services.sogr;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunStatus;
import com.camsys.assetcloud.needsforecaster.repositories.ProjectBuilderRunRepository;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;
import com.camsys.assetcloud.needsforecaster.services.sogr.runner.SogrRunner;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SogrProjectManager {
    private final ProjectBuilderRunRepository projectBuilderRunRepository;
    private final SogrBuilder builder;
    private final SogrRunner runner;

    public SogrProjectManager(ProjectBuilderRunRepository projectBuilderRunRepository,
                              SogrBuilder builder,
                              SogrRunner runner) {
        this.projectBuilderRunRepository = projectBuilderRunRepository;
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

        activateRunProcessing();

        return newRun;
    }

    //process waiting runs
    protected void activateRunProcessing() {
        List<ProjectBuilderRun> processingRuns = projectBuilderRunRepository.listProcessing();
        if (processingRuns.size() == 0) {
            //if no runs are currently processing, process waiting runs
            List<ProjectBuilderRun> waitingRuns = projectBuilderRunRepository.listWaiting();

            if (waitingRuns.size() > 0) {//at least one job waiting
                ProjectBuilderRun readyRun = waitingRuns.get(0);
                readyRun.status = ProjectBuilderRunStatus.PROCESSING;
                readyRun = projectBuilderRunRepository.save(readyRun);

                runner.run(readyRun, builder, (runId) -> processingComplete(runId), (runId) -> processingErrorHandler(runId));
            }
        }
    }

    protected void processingComplete(Long runId) {
        //finalize run status
        ProjectBuilderRun run = projectBuilderRunRepository.findById(runId).orElseThrow();
        run.status = ProjectBuilderRunStatus.COMPLETE;
        run.completeOn = new Date();
        projectBuilderRunRepository.save(run);

        //look for more waiting runs
        activateRunProcessing();
    }

    protected void processingErrorHandler(Long runId) {
        //update run status to error since something went wrong
        ProjectBuilderRun run = projectBuilderRunRepository.findById(runId).orElseThrow();
        run.status = ProjectBuilderRunStatus.ERROR;
        projectBuilderRunRepository.save(run);

        //look for more waiting runs
        activateRunProcessing();
    }



}
