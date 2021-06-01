import RetryableTaskInstance from './-private/retryable-task-instance';

export default function retryable(taskProperty, retryPolicy) {
  const baseTaskFn = taskProperty.taskFn;

  taskProperty.taskFn = function* (...args) {
    const instance = new RetryableTaskInstance({
      policy: retryPolicy,
      context: this,
      fn: baseTaskFn,
      args: args
    });
    return yield* instance.run();
  }

  return taskProperty;
}
