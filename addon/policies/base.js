export default class Policy {
  shouldRetry() { return false; }
  didError() {}
  didRetry() {}
  willRetry() {}
  *retry(retryInstance) {
    return yield* retryInstance.run();
  }
}
