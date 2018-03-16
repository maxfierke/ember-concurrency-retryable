export default class RetryableTaskInstance {
  constructor({ policy, fn, args }) {
    this.fn = fn;
    this.args = args;
    this.policy = policy;
    this.retryCount = 0;
  }

  *run() {
    try {
      return yield* this.fn.apply(this, this.args);
    } catch(e) {
      if (!this.policy.shouldRetry(this, e)) {
        throw e;
      }

      this.retryCount = this.retryCount + 1;
      return yield* this.policy.retry(this);
    }
  }
}
