import { module, test } from 'qunit';
import {
  retryable,
  defineModifier,
  Policy,
  DelayPolicy,
  ExponentialBackoffPolicy,
  isEnabled,
  disableRetries,
  enableRetries
} from 'ember-concurrency-retryable';
import PathExportedDefineModifier from 'ember-concurrency-retryable/define-modifier';
import PathExportedPolicy from 'ember-concurrency-retryable/policies/base';
import PathExportedDelayPolicy from 'ember-concurrency-retryable/policies/delay';
import PathExportedExponentialBackoffPolicy from 'ember-concurrency-retryable/policies/exponential-backoff';
import PathExportedRetryable from 'ember-concurrency-retryable/retryable';

module('Unit: module exports', function() {
  test("ember-concurrency-retryable", function(assert) {
    assert.ok(retryable);
    assert.ok(defineModifier);
    assert.ok(Policy);
    assert.ok(DelayPolicy);
    assert.ok(ExponentialBackoffPolicy);
    assert.ok(isEnabled);
    assert.ok(disableRetries);
    assert.ok(enableRetries);
  });

  test("ember-concurrency-retryable/define-modifier", function(assert) {
    assert.ok(PathExportedDefineModifier);
  });

  test("ember-concurrency-retryable/retryable", function(assert) {
    assert.ok(PathExportedRetryable);
  });

  test("ember-concurrency-retryable/policies", function(assert) {
    assert.ok(PathExportedPolicy);
    assert.ok(PathExportedDelayPolicy);
    assert.ok(PathExportedExponentialBackoffPolicy);
  });
});
