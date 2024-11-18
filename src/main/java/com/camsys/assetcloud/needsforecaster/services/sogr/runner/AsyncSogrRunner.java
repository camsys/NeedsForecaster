package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AsyncSogrRunner implements SogrRunner {
    private RunnerCallback callbacks;

    @Override
    public void initialize(RunnerCallback callbacks) {
        this.callbacks = callbacks;
    }

    @Async("taskExecutor")
    @Transactional
    @Override
    public void run(ProjectBuilderRun run, SogrBuilder builder) {
        System.out.println("Execute method - " + Thread.currentThread().getName());

        try {
            if (callbacks != null) callbacks.callbackBegin(run.id);
            builder.build(run);
            if (callbacks != null) callbacks.callbackComplete(run.id);
        }
        catch (Exception e) {
            if (callbacks != null) callbacks.callbackError(run.id);
            e.printStackTrace();
        }

        System.out.println("Task execution completed - " + Thread.currentThread().getName());
    }
}
//for reference
//https://www.geeksforgeeks.org/spring-boot-handling-background-tasks-with-spring-boot/
