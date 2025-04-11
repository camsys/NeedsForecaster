package com.camsys.assetcloud.needsforecaster.services.sogr.builder;

import com.camsys.assetcloud.needsforecaster.model.ProjectBuilderRun;
import com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunResult;

public interface SogrBuilder {
    ProjectBuilderRunResult build(ProjectBuilderRun run);
}
