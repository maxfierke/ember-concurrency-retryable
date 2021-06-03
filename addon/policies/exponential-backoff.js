import { assert } from '@ember/debug';
import DelayPolicy from './delay';

function buildIntervals(multiplier, minDelay, maxDelay) {
  let currentInterval = minDelay;
  const intervals = [];

  do {
    intervals.push(currentInterval);
    currentInterval = currentInterval * multiplier;
  } while (currentInterval <= maxDelay);

  intervals.push(maxDelay);

  return intervals;
}

/**
 * Multiplying policy that increases the delay with every retry
 *
 * @class ExponentialBackoffPolicy
 * @extends DelayPolicy
 */
export default class ExponentialBackoffPolicy extends DelayPolicy {
  /**
   * Constructor for ExponentialBackoffPolicy
   *
   * @constructor
   * @method constructor
   * @param {Object} options Options used for the policy
   * @param {number} [options.multiplier=2] Multiplier used to increse the duration after each try
   * @param {number} [options.minDelay=50] Minimum delay duration (in milliseconds)
   * @param {number} [options.maxDelay=500] Maximum delay duration (in milliseconds)
   */
  constructor({ multiplier = 2, minDelay = 50, maxDelay = 500, reasons = [] }) {
    assert(
      'The `multiplier` argument must be a Number',
      typeof multiplier === 'number'
    );
    assert(
      'The `minDelay` argument must be a Number',
      typeof minDelay === 'number'
    );
    assert(
      'The `maxDelay` argument must be a Number',
      typeof maxDelay === 'number'
    );

    const delay = buildIntervals(multiplier, minDelay, maxDelay);
    super({ delay, reasons });
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
   * Returns a boolean indicating whether or not the task instance
   * should be retried following an error thrown by the original
   * task instance generator function.
   *
   * @method shouldRetry
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @return {boolean}
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
   * Retries the task instance, delaying for the next millisecond duration
   * specified by the policy.
   *
   * @method retry
   * @param {RetryableTaskInstance} retryInstance
   * @return {IterableIterator<any>}
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
