# Retry Policies

## Included Policies

### Policy

`Policy` is the no-op or null policy. It provides no retry functionality, but
should be used as the base class for any policies that are implemented.

<pre><code class="typescript hljs">
import Policy from 'ember-concurrency-retryable/policies/base';

export class MyPolicy extends Policy {
  shouldRetry(retryInstance: RetryableTaskInstance, error: Error) {
    // ... do some custom logic
  }
}
</code></pre>

### DelayPolicy

`DelayPolicy` is the basic policy. It allows you to decide what the various
`delays` will be (in milliseconds) and allows you to specify a list of reasons
that can be used to limit the situations in which retries happen. `reasons` can
contain anything that might be thrown by the task that you want to target.
Reasons are checked against the thrown value by strict equality (`===`) or, if
the reason is something `class`-like, by `instanceof`. This allows you to limit
retries to things like `SomeSpecialError`.

Example:

```typescript
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';
// or import { DelayPolicy } from 'ember-concurrency-retryable';

const myDelayPolicy = new DelayPolicy({
  delay: [300, 600, 1200, 2400],
  reasons: [UnavailableError]
});
```

### ExponentialBackoffPolicy

`ExponentialBackoffPolicy` is a policy which increases the delay time
exponentially based on some settings. It allows specifing the `multiplier`,
`minDelay` and `maxDelay` (both in milliseconds), and allows you to specify a
list of reasons that can be used to limit the situations in which retries
happen.`reasons` can contain anything that might be thrown by the task that you
want to target. Reasons are checked against the thrown value by strict equality
(`===`) or, if the reason is something `class`-like, by `instanceof`. This
allows you to limit retries to things like `SomeSpecialError`.

Example:

```typescript
import ExponentialBackoffPolicy from 'ember-concurrency-retryable/policies/exponential-backoff';
// or import { ExponentialBackoffPolicy } from 'ember-concurrency-retryable';

const backoffPolicy = new ExponentialBackoffPolicy({
  multiplier: 1.5,
  minDelay: 30,
  maxDelay: 400
});

// This policy will retry tasks using the following delays:
// [30, 45, 67.5, 101.25, 151.875, 227.8125, 341.71875, 400];
```

## Adding retry policies

Retry policies are just plain old JavaScript classes/objects that correspond
to a particular interface. You can use those packaged with the addon, extend
from those, or build your own that fit your use case. A retry policy need only
correspond to the following interface:

```typescript
interface RetryableTaskInstance {
  lastError: Error?;
  retryCount: number;
  taskInstance: TaskInstance; // from ember-concurrency
  run(): IterableIterator<any>;
}

interface RetryPolicy {
  didError(retryInstance: RetryableTaskInstance, error: Error): void;
  shouldRetry(retryInstance: RetryableTaskInstance, reason: any): boolean;
  willRetry(retryInstance: RetryableTaskInstance, error: Error): void;
  retry(retryInstance: RetryableTaskInstance): IterableIterator<any>;
  didRetry(retryInstance: RetryableTaskInstance): void;
}
```

Retry policies are designed to be reusable across tasks and task instances,
so if you do implment your own, you should avoid storing anything
instance-specific in the policy itself, and instead use the instance data
provided as an argument to the callbacks.
