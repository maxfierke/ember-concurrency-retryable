export const RETRYABLE_SYMBOL = '__ec_retryable_instance';

// Private "symbols" from e-c. Copying until there's a public Yieldable API
const yieldableSymbol = "__ec_yieldable__";
const YIELDABLE_CONTINUE = "next";

export const getTaskInstance = {
  [yieldableSymbol](taskInstance, resumeIndex) {
    taskInstance.proceed(resumeIndex, YIELDABLE_CONTINUE, taskInstance);
  }
};

export const retriedSignal = {
  [yieldableSymbol](taskInstance, resumeIndex) {
    const retryableInstance = taskInstance[RETRYABLE_SYMBOL];

    if (retryableInstance && retryableInstance.retryCount > 0) {
      retryableInstance._didRetry();
    }

    taskInstance.proceed(resumeIndex, YIELDABLE_CONTINUE);
  }
};
