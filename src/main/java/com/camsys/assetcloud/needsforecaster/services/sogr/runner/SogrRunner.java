package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;

public interface SogrRunner {
    void run(ProjectBuilderRun run,
             SogrBuilder builder,
             RunnerCompletionCallback completionCallback,
             RunnerErrorCallback errorCallback);
}
