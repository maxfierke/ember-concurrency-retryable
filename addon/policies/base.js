export default class Policy {
  shouldRetry() { return false; }
  didError() {}
  didRetry() {}
  willRetry() {}
  *retry(retryInstance) {
    retryInstance._triggerEvent('retrying');
    return yield* retryInstance.run();
  }
}
