package com.camsys.assetcloud.needsforecaster.config;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.services.sogr.runner.RunnerCallback;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;

import java.lang.reflect.Method;

public class SogrRunnerAsyncExceptionHandler implements AsyncUncaughtExceptionHandler {
    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        //retrieve information from method call
        ProjectBuilderRun run = params[0] instanceof ProjectBuilderRun ? (ProjectBuilderRun) params[0] : null;
        RunnerCallback callbacks = params[2] instanceof RunnerCallback ? (RunnerCallback) params[2] : null;

        //run callbackError method that requester has designated
        if (callbacks != null && run != null) callbacks.callbackError(run.id);

        ex.printStackTrace();

        System.out.println("Task sogr runner errored - " + Thread.currentThread().getName());
    }
}
