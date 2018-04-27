/**
 * Policy base class for implementing retry policies. Provides
 * no functionality of its own, other than a `retry` implementation
 * that ensures the correct events fire.
 *
 * @class Policy
 * @constructor
 */
export default class Policy {
  /**
   * Hook which is called when a task instance errors but has
   * not yet been been checked against the policy for retry.
   *
   * @method didError
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @returns {void}
   * @since 0.3.1
   */
  didError() {}

  /**
   * Returns a boolean indicating whether or not the task instance
   * should be retried following an error thrown by the original
   * task instance generator function.
   *
   * @method shouldRetry
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @returns {boolean}
   */
  shouldRetry() { return false; }

  /**
   * Hook that is called before the task is passed to the policy
   * for retrying.
   *
   * @method willRetry
   * @param {RetryableTaskInstance} retryInstance
   * @param {Error} error
   * @returns {void}
   * @since 0.3.0
   */
  willRetry() {}

  /**
   * Defines how the policy retries the task instance.
   *
   * @method retry
   * @param {RetryableTaskInstance} retryInstance
   * @returns {IterableIterator<any>}
   */
  *retry(retryInstance) {
    retryInstance._triggerEvent('retrying');
    return yield* retryInstance.run();
  }

  /**
   * Hook that is called after a task has been successfully retried.
   *
   * @method didRetry
   * @param {RetryableTaskInstance} retryInstance
   * @returns {void}
   * @since 0.3.1
   */
  didRetry() {}
}
