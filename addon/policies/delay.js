import { isArray } from "@ember/array";
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { timeout } from 'ember-concurrency';
import Policy from './base';

export default class DelayPolicy extends Policy {
  constructor({ delay = [], reasons = [] }) {
    super();
    assert("The `delay` argument must be an array of Numbers representing milliseconds", isArray(delay) && delay.every(Number.isFinite));
    assert("The `reasons` argument must be an array of potentially caught errors", isArray(reasons));

    this.delay = delay;
    this.reasons = reasons;
  }

  shouldRetry(retryInstance, reason) {
    const retryAttempt = get(retryInstance, 'retryCount');
    const hasDelay = retryAttempt < this.delay.length;

    if (this.reasons.length > 0) {
      const reasonIsValid = this.reasons.some((r) => {
        if (typeof reason === 'object' && typeof r === 'function') {
          return r === reason || reason instanceof r
        }
        return r === reason;
      });

      return hasDelay && reasonIsValid;
    }

    return hasDelay;
  }

  *retry(retryInstance) {
    const retryCount = get(retryInstance, 'retryCount');
    const currentDelayMs = this.delay[retryCount];

    yield timeout(currentDelayMs);
    return yield* retryInstance.run();
  }
}
