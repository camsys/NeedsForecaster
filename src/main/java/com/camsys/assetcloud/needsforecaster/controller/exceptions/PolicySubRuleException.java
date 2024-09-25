package com.camsys.assetcloud.needsforecaster.controller.exceptions;

import com.camsys.assetcloud.needsforecaster.model.PolicySubRule;

public class PolicySubRuleException extends IllegalArgumentException {
    public PolicySubRuleException(String message, PolicySubRule policySubRule) {
        super(message + ": " + policySubRule.toExceptionString());
    }
}
