import { run, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import sinon from 'sinon';
import ExponentialBackoffPolicy from 'ember-concurrency-retryable/policies/exponential-backoff';

module('Unit: ExponentialBackoffPolicy', function() {
  class FakeError {}

  test("uses exponentially constructed delays", function (assert) {
    const backoffPolicy = new ExponentialBackoffPolicy({
      multiplier: 2,
      minDelay: 30,
      maxDelay: 600
    });
    assert.deepEqual(backoffPolicy.delay, [30, 60, 120, 240, 480, 600], "expected to have exponentially expanded delay timings");
  });

  test("#shouldRetry checks the retry count against number of delay steps", function (assert) {
    const backoffPolicy = new ExponentialBackoffPolicy({
      multiplier: 2,
      minDelay: 30,
      maxDelay: 600
    });
    assert.notOk(backoffPolicy.shouldRetry({ retryCount: 6 }), 'expected to be told not to retry');
    assert.notOk(backoffPolicy.shouldRetry({ retryCount: 7 }), 'expected to be told not to retry');
    assert.ok(backoffPolicy.shouldRetry({ retryCount: 1 }), 'expected to be told to retry');
  });

  test("#shouldRetry should check if the reason matches what we want to retry", function (assert) {
    const backoffPolicy = new ExponentialBackoffPolicy({
      multiplier: 1.3333,
      minDelay: 30,
      maxDelay: 100,
      reasons: ["foo message", FakeError]
    });
    assert.ok(backoffPolicy.shouldRetry({ retryCount: 1 }, new FakeError("hello")), 'expected to be told to retry');
    assert.ok(backoffPolicy.shouldRetry({ retryCount: 1 }, "foo message"), 'expected to be told to retry');
    assert.notOk(backoffPolicy.shouldRetry({ retryCount: 1 }, new Error("something unexpected")), 'expected not to be told to retry');
  });

  test("`TaskProperty`s can be extended as restryable with an ExponentialBackoffPolicy", function(assert) {
    assert.expect(11);

    const done = assert.async(1);
    let taskAttemptCounter = 0;

    const backoffPolicy = new ExponentialBackoffPolicy({
      multiplier: 1.5,
      minDelay: 30,
      maxDelay: 400
    });

    const willRetryStub = sinon.stub(backoffPolicy, 'willRetry');

    const expectedDelays = [30, 45, 67.5, 101.25, 151.875, 227.8125, 341.71875, 400];
    assert.deepEqual(backoffPolicy.delay, expectedDelays);

    let Obj = EmberObject.extend({
      doStuff: task(function * () {
        taskAttemptCounter++;

        if (taskAttemptCounter <= 2 || taskAttemptCounter > 4) {
          yield Promise.resolve('stuff happened');
        } else {
          throw new Error('solar flare interrupted stuff');
        }
      }).retryable(backoffPolicy)
    });

    let obj;

    assert.equal(taskAttemptCounter, 0);

    run(() => {
      obj = Obj.create();
      obj.get('doStuff').perform();
    });

    assert.equal(taskAttemptCounter, 1);
    assert.notOk(willRetryStub.called, 'expect not to have started retrying');


    run(() => {
      obj.get('doStuff').perform();
    });

    assert.equal(taskAttemptCounter, 2);
    assert.notOk(willRetryStub.called, 'expect not to have started retrying');

    run(() => {
      obj.get('doStuff').perform();
    });

    assert.equal(taskAttemptCounter, 3);
    assert.ok(willRetryStub.calledOnce, 'expect to have started retrying');

    later(() => {
      assert.equal(taskAttemptCounter, 5);
      assert.ok(willRetryStub.calledTwice, 'expect to have been retried twice');

      obj.get('doStuff').perform();
      assert.equal(taskAttemptCounter, 6);
      done();
    }, 100 + 40);
  });

  test("Tasks throw errors after exhausting ExponentialBackoffPolicy delays", function(assert) {
    assert.expect(4);

    const done = assert.async(1);
    let taskAttemptCounter = 0;

    const backoffPolicy = new ExponentialBackoffPolicy({
      multiplier: 2,
      minDelay: 10,
      maxDelay: 300
    });

    let Obj = EmberObject.extend({
      doStuff: task(function* () {
        taskAttemptCounter++;
        yield "hello";
        throw new Error('I will never complete');
      }).retryable(backoffPolicy)
    });

    let obj;

    assert.equal(taskAttemptCounter, 0);

    run(() => {
      obj = Obj.create();
      obj.get('doStuff').perform().catch((e) => {
        assert.equal(e.message, "I will never complete", "expected to have thrown original error");
        assert.equal(taskAttemptCounter, 7, "expected to have been run seven times");
        done();
      });
      assert.equal(taskAttemptCounter, 1);
    });
  });
});
