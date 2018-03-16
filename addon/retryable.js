import { assert } from '@ember/debug';
import RetryableTaskInstance from './-private/retryable-task-instance';

export default function retryable(taskProperty, retryPolicy) {
  assert("retryable() will only work with ember-concurrency >=0.7.19 -- please upgrade", taskProperty.taskFn);

  const baseTaskFn = taskProperty.taskFn;

  taskProperty.taskFn = function* (...args) {
    const instance = new RetryableTaskInstance({
      policy: retryPolicy,
      fn: baseTaskFn,
      args: args
    });
    return yield* instance.run();
  }

  return taskProperty;
}
