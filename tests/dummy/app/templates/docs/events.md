# Events

You can also listen to a few ember-concurrency-retryable lifecycle events in
addition to those provided by ember-concurrency when using the `.evented()`
modifier.

## `TASK_NAME:retrying`
Fired each time the task instance is retrying. This can be multiple times for each task
instance, as depending on the policy multiple retries may occur.

```typescript
on('someTask:retrying', function (taskInstance: TaskInstance, retryableTaskInstance: RetryableTaskInstance) {
  // ...
}
```

## `TASK_NAME:retried`
Fired when a task instance has finished being retried. This fires at roughly the
same time as `TASK_NAME:succeeded` but can be used to seperate logic that you'd
only want running on successful task instance completion when it had previously
been retried. This event will only be fired once per task instance, regardless
of how many times the task instance was retried.

```typescript
on('someTask:retried', function (taskInstance: TaskInstance, retryableTaskInstance: RetryableTaskInstance) {
  // ...
}
```
