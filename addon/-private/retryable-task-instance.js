import { isEnabled } from "../index";
import { getTaskInstance } from "./yieldables";

const EMPTY_RETRIES = 0;

/**
 * RetryableTaskInstance contains state related to the retrying
 * of a task instance. It is provided as an argument to retry
 * policy hooks and ember-concurrency-retryable lifecycle events.
 *
 * @class RetryableTaskInstance
*/
export default class RetryableTaskInstance {
  /**
   * Fired when a task instance is retried in accordance with its
   * retry policy.
   *
   * @event TASK_NAME:retrying
   * @param {TaskInstance} taskInstance TaskInstance from ember-concurrency
   * @param {RetryableTaskInstance} retryInstance
   */

  /**
   * Fired when a task instance has succeeded after being retried in
   * accordance with its retry policy.
   *
   * @event TASK_NAME:retried
   * @param {TaskInstance} taskInstance TaskInstance from ember-concurrency
   * @param {RetryableTaskInstance} retryInstance
   */

  /**
   * Number of times the task instance has been retried
   *
   * @property retryCount
   * @type number
   * @default 0
   * @readOnly
   */

  /**
   * The last error that triggered a retry of the task instance
   *
   * @property lastError
   * @type Error?
   * @readOnly
   */

  /**
   * ember-concurrency TaskInstance for the RetryableTaskInstance
   *
   * @property taskInstance
   * @type TaskInstance?
   * @readOnly
   */

  constructor({ policy, context, fn, args }) {
    this.context = context;
    this.fn = fn;
    this.args = args;
    this.policy = policy;
    this.retryCount = 0;
    this.lastError = null;
    this.taskInstance = null;
    this._retrySemaphore = EMPTY_RETRIES;
  }

  *run() {
    try {
      return yield* this.fn.apply(this.context, this.args);
    } catch(e) {
      if (!this.taskInstance) {
        this.taskInstance = yield getTaskInstance;
      }

      this.lastError = e;

      triggerHook(this, 'didError', e);

      if (!this.policy.shouldRetry(this, e) || !isEnabled()) {
        throw e;
      }

      this.retryCount = this.retryCount + 1;

      triggerHook(this, 'willRetry', e);

      this._retrySemaphore++;
      const result = yield* this.policy.retry(this);
      this._retrySemaphore--;

      if (this._retrySemaphore === EMPTY_RETRIES) {
        triggerHook(this, 'didRetry');
        this._triggerEvent('retried');
      }

      return result;
    }
  }

  _triggerEvent(eventName, ...args) {
    const taskInstance = this.taskInstance;

    // No-op if on an e-c <= 0.8.17
    if (!taskInstance._triggerEvent) { return; }

    const eventArgs = [taskInstance, this, ...args];
    taskInstance._triggerEvent(eventName, ...eventArgs);
  }
}

function triggerHook(instance, hookName, ...args) {
  const hookCallbackArgs = [instance, ...args];
  instance.policy[hookName].apply(instance.policy, hookCallbackArgs);
}
