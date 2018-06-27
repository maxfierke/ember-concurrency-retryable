export { default as retryable } from './retryable';
export { default as defineModifier } from './define-modifier';
export { default as Policy } from './policies/base';
export { default as DelayPolicy } from './policies/delay';
export { default as ExponentialBackoffPolicy } from './policies/exponential-backoff';
export {
  retried
} from './-private/yieldables';

let ENABLED = true;

export function isEnabled() {
  return ENABLED;
}

export function disable() {
  ENABLED = false;
}

export function enable() {
  ENABLED = true;
}
