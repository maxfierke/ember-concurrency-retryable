import { deprecate } from '@ember/debug';

export { default as retryable } from './retryable';
export { default as defineModifier } from './define-modifier';
export { default as Policy } from './policies/base';
export { default as DelayPolicy } from './policies/delay';
export { default as ExponentialBackoffPolicy } from './policies/exponential-backoff';
export {
  retriedSignal
} from './-private/yieldables';

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

export function enable() {
  deprecate("enable is deprecated in favor of enableTaskRetries", false, {
    id: 'ember-concurrency-retryable.enable',
    until: '0.8.0'
  });
  enableTaskRetries();
}

export function disable() {
  deprecate("disable is deprecated in favor of disableTaskRetries", false, {
    id: 'ember-concurrency-retryable.disable',
    until: '0.8.0'
  });
  disableTaskRetries();
}
