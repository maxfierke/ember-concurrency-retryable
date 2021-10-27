export { default as retryable } from './retryable';
export { default as Policy } from './policies/base';
export { default as DelayPolicy } from './policies/delay';
export { default as ExponentialBackoffPolicy } from './policies/exponential-backoff';
export { retriedSignal } from './-private/yieldables';

import retryable from './retryable';
import { registerModifier, TaskProperty } from 'ember-concurrency';

let ENABLED = true;

export function isEnabled() {
  return ENABLED;
}

export function disableTaskRetries() {
  ENABLED = false;
}

export function enableTaskRetries() {
  ENABLED = true;
}

registerModifier('retryable', retryable);

// Legacy TaskProperty
TaskProperty.prototype.retryable = function (retryPolicy) {
  let taskFn = this.taskFn;
  let setTaskDefinition = (fn) => {
    this.taskFn = fn;
  };

  let taskFactory = {
    get taskDefinition() {
      return taskFn;
    },
    setTaskDefinition,
  };

  retryable(taskFactory, retryPolicy);

  return this;
};
