package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.services.sogr.builder.SogrBuilder;

public interface SogrRunner {
    void initialize(RunnerCallback callbacks);

    void run(ProjectBuilderRun run, SogrBuilder builder);
}
