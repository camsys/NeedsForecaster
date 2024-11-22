package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncSogrRunner implements SogrRunner {

    @Async("sogrRunnerTaskExecutor")
    @Override
    public void run(ProjectBuilderRun run, SogrBuilder builder, RunnerCallback callbacks) {
        System.out.println("Execute sogr run - " + Thread.currentThread().getName());

        if (callbacks != null) callbacks.callbackBegin(run.id);
        builder.build(run);
        if (callbacks != null) callbacks.callbackComplete(run.id);

        System.out.println("Task sogr run completed - " + Thread.currentThread().getName());
    }
}
//for reference
//https://www.geeksforgeeks.org/spring-boot-handling-background-tasks-with-spring-boot/
