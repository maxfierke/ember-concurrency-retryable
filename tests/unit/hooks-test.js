import EmberObject from '@ember/object';
import { run, later } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';
import sinon from 'sinon';
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';
import RetryableTaskInstance from 'ember-concurrency-retryable/-private/retryable-task-instance';

module('Unit: hooks');

test("Retryable tasks have lifecycle hooks", function(assert) {
  assert.expect(9);

  const DELAY_MS = 100;
  const EXPECTED_ERROR = new Error('solar flare interrupted stuff');

  const done = assert.async(1);
  let taskAttemptCounter = 0;

  const delayPolicy = new DelayPolicy({ delay: [DELAY_MS, DELAY_MS] });

  const didErrorStub = sinon.collection.stub(delayPolicy, 'didError');
  const willRetryStub = sinon.collection.stub(delayPolicy, 'willRetry');
  const didRetryStub = sinon.collection.stub(delayPolicy, 'didRetry');

  let Obj = EmberObject.extend({
    doStuff: task(function * () {
      taskAttemptCounter++;

      if (taskAttemptCounter === 1) {
        throw EXPECTED_ERROR;
      } else {
        yield Promise.resolve('stuff happened');
      }
    }).retryable(delayPolicy)
  });

  let obj;

  assert.equal(taskAttemptCounter, 0);

  run(() => {
    obj = Obj.create();
  });

  run(() => {
    obj.get('doStuff').perform();
    assert.equal(taskAttemptCounter, 1);
    assert.ok(didErrorStub.calledOnceWith(
      sinon.match.instanceOf(RetryableTaskInstance),
      EXPECTED_ERROR
    ), 'expected didError to have been called with the retry instance & error');
    assert.ok(willRetryStub.calledOnceWith(
      sinon.match.instanceOf(RetryableTaskInstance),
      EXPECTED_ERROR
    ), 'expected willRetry to have been called with the retry instance & error');
    assert.ok(
      willRetryStub.calledAfter(didErrorStub),
      'expect willRetry to have been called after didError'
    );
    assert.notOk(didRetryStub.called, 'expect not to have completed retrying yet');

    later(() => {
      assert.equal(taskAttemptCounter, 2);
      assert.ok(didRetryStub.calledOnceWith(
        sinon.match.instanceOf(RetryableTaskInstance)
      ), 'expected didRetry to have been called with the retry instance');
      assert.ok(
        didRetryStub.calledAfter(willRetryStub),
        'expect didRetry to have been called after willRetry'
      );
      done();
    }, DELAY_MS + 10);
  });
});
