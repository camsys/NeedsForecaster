package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AsyncSogrRunner implements SogrRunner {

    @Async("taskExecutor")
    @Transactional
    @Override
    public void run(ProjectBuilderRun run, SogrBuilder builder, RunnerCompletionCallback completionCallback, RunnerErrorCallback errorCallback) {
        System.out.println("Execute method - " + Thread.currentThread().getName());

        try {
            builder.build(run);
            if (completionCallback != null) completionCallback.callback(run.id);
        }
        catch (Exception e) {
            if (errorCallback != null) errorCallback.callback(run.id);
            e.printStackTrace();
        }

        System.out.println("Task execution completed - " + Thread.currentThread().getName());
    }
}
//for reference
//https://www.geeksforgeeks.org/spring-boot-handling-background-tasks-with-spring-boot/
