package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

import com.camsys.assetcloud.needsforecaster.model.enums.ProjectBuilderRunResult;

public interface RunnerCallback {
    void callbackBegin(Long runId);
    void callbackComplete(Long runId, ProjectBuilderRunResult result);
    void callbackError(Long runId);
}
