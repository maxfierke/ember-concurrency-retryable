import RetryableTaskInstance from './-private/retryable-task-instance';

export default function retryable(taskFactory, retryPolicy) {
  const baseTaskFn = taskFactory.taskDefinition;

  const wrappedTaskFn = function* (...args) {
    const instance = new RetryableTaskInstance({
      policy: retryPolicy,
      context: this,
      fn: baseTaskFn,
      args: args,
    });
    return yield* instance.run();
  };
  taskFactory.setTaskDefinition(wrappedTaskFn);

  return taskFactory;
}
