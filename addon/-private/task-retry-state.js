export default class TaskRetryState {
  constructor(baseTaskFn, args) {
    this.retryCount = 0;
    this.baseTaskFn = baseTaskFn;
    this.args = args;
  }

  *run(retryPolicy) {
    try {
      return yield* this.baseTaskFn.apply(this, this.args);
    } catch(e) {
      if (!retryPolicy.shouldRetry(this, e)) {
        throw e;
      }

      this.retryCount = this.retryCount + 1;
      return yield* retryPolicy.retry(this);
    }
  }
}
