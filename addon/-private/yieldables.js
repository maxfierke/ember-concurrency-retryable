import { Yieldable } from 'ember-concurrency';

export const RETRYABLE_SYMBOL = '__ec_retryable_instance';
class RetriedSignalYieldable extends Yieldable {
  onYield(state) {
    const taskInstance = state.getTaskInstance();
    const retryableInstance = taskInstance[RETRYABLE_SYMBOL];

    if (retryableInstance && retryableInstance.retryCount > 0) {
      retryableInstance._didRetry();
    }

    state.next();
  }
}

class GetTaskInstanceYieldable extends Yieldable {
  onYield(state) {
    state.next(state.getTaskInstance());

    return () => {};
  }
}

export const getTaskInstance = new GetTaskInstanceYieldable();
export const retriedSignal = new RetriedSignalYieldable();
