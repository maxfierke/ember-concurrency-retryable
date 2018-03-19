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
      if (!this.policy.shouldRetry(this, e) || !isEnabled()) {
        throw e;
      }

      this.retryCount = this.retryCount + 1;
      return yield* this.policy.retry(this);
    }
  }
}
