import EmberObject from '@ember/object';
import Evented, { on } from '@ember/object/evented';
import { run, later } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';
import sinon from 'sinon';
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';
import RetryableTaskInstance from 'ember-concurrency-retryable/-private/retryable-task-instance';

module('Unit: state', function () {
  test('resets retryable state after task is retried successfully', function (assert) {
    assert.expect(8);

    const DELAY_MS = 100;
    const EXPECTED_ERROR = new Error('solar flare interrupted stuff');

    const done = assert.async(1);
    let taskAttemptCounter = 0;
    let lastRetryCount = 0;
    let lastRetryError = null;
    let lastRetryableInstance = null;

    const delayPolicy = new DelayPolicy({
      delay: [DELAY_MS, DELAY_MS, DELAY_MS, DELAY_MS],
    });

    const retriedStub = sinon.stub();

    let Obj = EmberObject.extend(Evented, {
      doStuff: task(function* () {
        taskAttemptCounter++;

        if (taskAttemptCounter <= 3) {
          throw EXPECTED_ERROR;
        } else {
          yield Promise.resolve('stuff happened');
        }
      })
        .evented()
        .retryable(delayPolicy),

      onRetried: on('doStuff:retried', function (_ti, retryableTaskInstance) {
        lastRetryCount = retryableTaskInstance.retryCount;
        lastRetryError = retryableTaskInstance.lastError;
        lastRetryableInstance = retryableTaskInstance;
        retriedStub(_ti, retryableTaskInstance);
      }),
    });

    let obj, taskInstance;

    assert.equal(taskAttemptCounter, 0);

    run(() => {
      obj = Obj.create();
    });

    run(() => {
      taskInstance = obj.get('doStuff').perform();
      assert.equal(taskAttemptCounter, 1);
    });

    later(() => {
      assert.equal(taskAttemptCounter, 4);
      assert.ok(
        retriedStub.calledOnceWith(
          taskInstance,
          sinon.match.instanceOf(RetryableTaskInstance)
        ),
        'expected retried callback to have been called once with correct arguments'
      );
      assert.equal(
        lastRetryCount,
        3,
        'retried hook is called before retryCount is reset'
      );
      assert.equal(lastRetryableInstance.retryCount, 0);
      assert.equal(
        lastRetryError,
        EXPECTED_ERROR,
        'retried hook is called before lastError is reset'
      );
      assert.equal(lastRetryableInstance.lastError, null);

      done();
    }, DELAY_MS * 4 + 10);
  });
});
