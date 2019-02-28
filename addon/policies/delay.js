import { isArray } from "@ember/array";
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { timeout } from 'ember-concurrency';
import Policy from './base';

/**
 * Flexible delaying retry policy that allows for specifying the
 * delays and allowing for retrying on specfic errors.
 *
 * @class DelayPolicy
 * @extends Policy
 */
export default class DelayPolicy extends Policy {
  /**
   * Constructor for DelayPolicy
   *
   * @constructor
   * @method constructor
   * @param {Object} options Options used for the policy
   * @param {Array<number>} [options.delay] Array of numbers representing milliseconds to delay
   * @param {Array<Error>} [options.reasons] Array of potentially caught errors which should trigger task retries
   */
  constructor({ delay = [], reasons = [] }) {
    super();
    assert("The `delay` argument must be an array of Numbers representing milliseconds", isArray(delay) && delay.every(Number.isFinite));
    assert("The `reasons` argument must be an array of potentially caught errors", isArray(reasons));

    this.delay = delay;
    this.reasons = reasons;
  }

  /**
   * Returns a boolean indicating whether or not the task instance
   * should be retried following an error thrown by the original
   * task instance generator function.
   *
   * @method shouldRetry
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @return {boolean}
   */
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

  /**
   * Retries the task instance, delaying for the next millisecond duration
   * specified by the policy.
   *
   * @method retry
   * @param {RetryableTaskInstance} retryInstance
   * @return {IterableIterator<any>}
   */
  *retry(retryInstance) {
    const retryCount = get(retryInstance, 'retryCount');
    const currentDelayMs = this.delay[retryCount - 1];

    assert("DelayPolicy.delay was unexpectedly exhausted.", Number.isFinite(currentDelayMs));

    yield timeout(currentDelayMs);
    return yield* super.retry(retryInstance);
  }

  /**
   * Hook which is called when a task instance errors but has
   * not yet been been checked against the policy for retry.
   *
   * @method didError
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @return {void}
   * @since 0.3.1
   */

  /**
   * Hook that is called before the task is passed to the policy
   * for retrying.
   *
   * @method willRetry
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @return {void}
   * @since 0.3.0
   */

   /**
   * Hook that is called after a task has been successfully retried.
   *
   * @method didRetry
   * @param {RetryableTaskInstance} retryInstance
   * @return {void}
   * @since 0.3.1
   */
}
