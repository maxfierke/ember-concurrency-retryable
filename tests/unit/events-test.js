import EmberObject from '@ember/object';
import Evented, { on } from '@ember/object/evented';
import { run, later } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { Promise } from 'rsvp';
import sinon from 'sinon';
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';
import RetryableTaskInstance from 'ember-concurrency-retryable/-private/retryable-task-instance';

module('Unit: events', function () {
  test('evented() tasks fire retrying & retried events', function (assert) {
    assert.expect(7);

    const DELAY_MS = 100;
    const EXPECTED_ERROR = new Error('solar flare interrupted stuff');

    const done = assert.async(1);
    let taskAttemptCounter = 0;

    const delayPolicy = new DelayPolicy({
      delay: [DELAY_MS, DELAY_MS, DELAY_MS, DELAY_MS],
    });

    const retryingStub = sinon.stub();
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

      onRetrying: on('doStuff:retrying', retryingStub),
      onRetried: on('doStuff:retried', retriedStub),
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
      assert.equal(
        retryingStub.callCount,
        3,
        'expected `retrying` event to be fired each time the taskFn is retried'
      );
      assert.ok(
        retryingStub.alwaysCalledWith(
          taskInstance,
          sinon.match.instanceOf(RetryableTaskInstance)
        ),
        'expected retrying callback to have received correct arguments'
      );
      assert.ok(
        retriedStub.calledOnceWith(
          taskInstance,
          sinon.match.instanceOf(RetryableTaskInstance)
        ),
        'expected retried callback to have been called once with correct arguments'
      );
      assert.ok(
        retriedStub.calledAfter(retryingStub),
        'expect `retried` to have been fired after `retrying`'
      );

      done();
    }, DELAY_MS * 4 + 10);
  });
});
