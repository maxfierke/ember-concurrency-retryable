export default class Policy {
  shouldRetry() { return false; }
  willRetry() {}
  *retry(retryInstance) {
    return yield* retryInstance.run();
  }
}
