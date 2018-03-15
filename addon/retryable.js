import { assert } from '@ember/debug';
import TaskRetryState from './-private/task-retry-state';

export default function retryable(taskProperty, retryPolicy) {
  assert("retryable() will only work with ember-concurrency >=0.7.19 -- please upgrade", taskProperty.taskFn);

  const baseTaskFn = taskProperty.taskFn;

  taskProperty.taskFn = function* (...args) {
    const retryState = new TaskRetryState(baseTaskFn, args);
    return yield* retryState.run(retryPolicy);
  }

  return taskProperty;
}
