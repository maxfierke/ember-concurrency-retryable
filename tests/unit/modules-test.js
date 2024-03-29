import { module, test } from 'qunit';
import {
  retryable,
  Policy,
  DelayPolicy,
  ExponentialBackoffPolicy,
  isEnabled,
  disableTaskRetries,
  enableTaskRetries,
} from 'ember-concurrency-retryable';
import PathExportedPolicy from 'ember-concurrency-retryable/policies/base';
import PathExportedDelayPolicy from 'ember-concurrency-retryable/policies/delay';
import PathExportedExponentialBackoffPolicy from 'ember-concurrency-retryable/policies/exponential-backoff';
import PathExportedRetryable from 'ember-concurrency-retryable/retryable';

module('Unit: module exports', function () {
  test('ember-concurrency-retryable', function (assert) {
    assert.ok(retryable);
    assert.ok(Policy);
    assert.ok(DelayPolicy);
    assert.ok(ExponentialBackoffPolicy);
    assert.ok(isEnabled);
    assert.ok(disableTaskRetries);
    assert.ok(enableTaskRetries);
  });

  test('ember-concurrency-retryable/retryable', function (assert) {
    assert.ok(PathExportedRetryable);
  });

  test('ember-concurrency-retryable/policies', function (assert) {
    assert.ok(PathExportedPolicy);
    assert.ok(PathExportedDelayPolicy);
    assert.ok(PathExportedExponentialBackoffPolicy);
  });
});
