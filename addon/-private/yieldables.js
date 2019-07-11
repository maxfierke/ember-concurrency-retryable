import {
  yieldableSymbol,
  YIELDABLE_CONTINUE
} from 'ember-concurrency/-private/external/yieldables';

export const RETRYABLE_SYMBOL = '__ec_retryable_instance';


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
