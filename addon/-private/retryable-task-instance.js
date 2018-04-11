import { isEnabled } from "../index";

export default class RetryableTaskInstance {
  constructor({ policy, context, fn, args }) {
    this.context = context;
    this.fn = fn;
    this.args = args;
    this.policy = policy;
    this.retryCount = 0;
  }

  *run() {
    try {
      return yield* this.fn.apply(this.context, this.args);
    } catch(e) {
      triggerHook(this, 'didError', e);

      if (!this.policy.shouldRetry(this, e) || !isEnabled()) {
        throw e;
      }

      this.retryCount = this.retryCount + 1;

      triggerHook(this, 'willRetry', e);

      const result = yield* this.policy.retry(this);

      triggerHook(this, 'didRetry');

      return result;
    }
  }
}

function triggerHook(instance, hookName, ...args) {
  const hookCallbackArgs = [instance, ...args];
  instance.policy[hookName].apply(instance.policy, hookCallbackArgs);
}
