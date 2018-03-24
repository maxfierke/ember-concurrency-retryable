import { run, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';
import sinon from 'sinon';

module('Unit: DelayPolicy');

class FakeError {}

test("#shouldRetry checks the retry count against number of delay steps", function (assert) {
  const delayPolicy = new DelayPolicy({ delay: [150, 300] });
  assert.notOk(delayPolicy.shouldRetry({ retryCount: 2 }), 'expected to be told not to retry');
  assert.notOk(delayPolicy.shouldRetry({ retryCount: 4 }), 'expected to be told not to retry');
  assert.ok(delayPolicy.shouldRetry({ retryCount: 1 }), 'expected to be told to retry');
});

test("#shouldRetry should check if the reason matches what we want to retry", function (assert) {
  const delayPolicy = new DelayPolicy({ delay: [150, 300], reasons: ["foo message", FakeError] });
  assert.ok(delayPolicy.shouldRetry({ retryCount: 1 }, new FakeError("hello")), 'expected to be told to retry');
  assert.ok(delayPolicy.shouldRetry({ retryCount: 1 }, "foo message"), 'expected to be told to retry');
  assert.notOk(delayPolicy.shouldRetry({ retryCount: 1 }, new Error("something unexpected")), 'expected not to be told to retry');
});

test("`TaskProperty`s can be extended as restryable with a DelayPolicy", function(assert) {
  assert.expect(10);

  const DELAY_MS = 100;
  const done = assert.async(1);
  let taskAttemptCounter = 0;

  const delayPolicy = new DelayPolicy({ delay: [DELAY_MS, DELAY_MS] });

  const willRetryStub = sinon.collection.stub(delayPolicy, 'willRetry');

  let Obj = EmberObject.extend({
    doStuff: task(function * () {
      taskAttemptCounter++;

      if (taskAttemptCounter <= 2 || taskAttemptCounter > 4) {
        yield Promise.resolve('stuff happened');
      } else {
        throw new Error('solar flare interrupted stuff');
      }
    }).retryable(delayPolicy)
  });

  let obj;

  assert.equal(taskAttemptCounter, 0);

  run(() => {
    obj = Obj.create();
    obj.get('doStuff').perform();
    assert.equal(taskAttemptCounter, 1);
    assert.notOk(willRetryStub.called, 'expect not to have started retrying');
  });


  run(() => {
    obj.get('doStuff').perform();

    assert.equal(taskAttemptCounter, 2);
    assert.notOk(willRetryStub.called, 'expect not to have started retrying');
  });

  run(() => {
    obj.get('doStuff').perform();
    assert.equal(taskAttemptCounter, 3);
    assert.ok(willRetryStub.calledOnce, 'expect to have started retrying');

    later(() => {
      assert.equal(taskAttemptCounter, 5);
      assert.ok(willRetryStub.calledTwice, 'expect to have been retried twice');

      obj.get('doStuff').perform();
      assert.equal(taskAttemptCounter, 6);
      done();
    }, (DELAY_MS * 2) + 10);
  });
});

test("Tasks throw errors after exhausting DelayPolicy delays", function(assert) {
  assert.expect(4);

  const done = assert.async(1);
  let taskAttemptCounter = 0;

  const delayPolicy = new DelayPolicy({ delay: [100, 200, 300] });

  let Obj = EmberObject.extend({
    doStuff: task(function* () {
      taskAttemptCounter++;
      yield "hello";
      throw new Error('I will never complete');
    }).retryable(delayPolicy)
  });

  let obj;

  assert.equal(taskAttemptCounter, 0);

  run(() => {
    obj = Obj.create();
    obj.get('doStuff').perform().catch((e) => {
      assert.equal(e.message, "I will never complete", "expected to have thrown original error");
      assert.equal(taskAttemptCounter, 4, "expected to have been run four times");
      done();
    });
    assert.equal(taskAttemptCounter, 1);
  });
});
