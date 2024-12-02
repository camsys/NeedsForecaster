package com.camsys.assetcloud.needsforecaster.services.sogr.runner;

public interface RunnerCallback {
    void callbackBegin(Long runId);
    void callbackComplete(Long runId);
    void callbackError(Long runId);
}
