import { run, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import Evented, { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { DelayPolicy, retried } from 'ember-concurrency-retryable';
import sinon from 'sinon';

module('Unit: looping tasks');

test("looping tasks do not retain retry state between sets of failures", function(assert) {
  assert.expect(5);

  const DELAY_MS = 100;
  const done = assert.async(1);
  let taskAttemptCounter = 0;

  const delayPolicy = new DelayPolicy({ delay: [DELAY_MS, DELAY_MS, DELAY_MS] });
  const retriedStub = sinon.collection.stub();

  const FAIL_ATTEMPTS = [3, 4, 7, 8];

  let Obj = EmberObject.extend(Evented, {
    doStuff: task(function * () {
      while (true) {
        taskAttemptCounter++;

        if (taskAttemptCounter === 9) { return; }

        if (FAIL_ATTEMPTS.includes(taskAttemptCounter)) {
          throw new Error('solar flare interrupted stuff');
        }

        yield Promise.resolve('stuff happened');
        yield retried();
      }
    }).drop().evented().retryable(delayPolicy),

    onRetried: on('doStuff:retried', function(_ti, retryableTaskInstance) {
      assert.equal(retryableTaskInstance.retryCount, 2, 'expected to have required 2 retries');
      retriedStub();
    })
  });

  let obj;

  assert.equal(taskAttemptCounter, 0);

  run(() => {
    obj = Obj.create();
    obj.get('doStuff').perform();
  });

  later(() => {
    assert.equal(taskAttemptCounter, 9);
    assert.equal(retriedStub.callCount, 2, 'expected to have successfully retried two sets');

    done();
  }, (DELAY_MS * 7) + 10);
});
