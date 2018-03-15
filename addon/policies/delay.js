import { isArray } from "@ember/array";
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { timeout } from 'ember-concurrency';

export default class DelayPolicy {
  constructor({ delay = [], reasons = [] }) {
    this.delay = delay;
    this.reasons = reasons;

    assert("The `delay` argument must be a Number or an array of Numbers representing milliseconds", typeof this.delay === 'number' || isArray(this.delay));
    assert("The `reasons` argument must be an array of potentially caught errors", isArray(this.reasons));
  }

  shouldRetry(retryState, reason) {
    const retryAttempt = get(retryState, 'retryCount');
    const hasDelay = retryAttempt < this.delay.length;

    if (this.reasons.length > 0) {
      const reasonIsValid = this.reasons
        .any((r) => r === reason || reason instanceof r);

      return hasDelay && reasonIsValid;
    }

    return hasDelay;
  }

  *retry(retryState) {
    const retryCount = get(retryState, 'retryCount');
    const currentDelayMs = this.delay[retryCount];

    yield timeout(currentDelayMs);
    return yield* retryState.run(this);
  }
}
