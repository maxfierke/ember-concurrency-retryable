export { default as retryable } from './retryable';
export { default as defineModifer } from './define-modifier';
export { default as DelayPolicy } from './policies/delay';
export { default as ExponentialBackoffPolicy } from './policies/exponential-backoff';

export let ENABLED = true;

export function isEnabled() {
  return ENABLED;
}

export function disable() {
  ENABLED = false;
}

export function enable() {
  ENABLED = true;
}
