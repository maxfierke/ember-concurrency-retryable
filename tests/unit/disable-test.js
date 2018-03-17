import EmberObject from '@ember/object';
import { run, later } from '@ember/runloop';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { isEnabled, enable, disable, DelayPolicy } from 'ember-concurrency-retryable';

module('Unit: disabling retryability');

test("ember-concurrency-retryable can be disabled to ease testing of failure and remove delays", function(assert) {
  assert.expect(7);

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

    disable();
    assert.notOk(isEnabled(), "expected retryablity to be disabled");

    obj.get('doStuff').perform().catch((e) => assert.equal(e.message, 'I will never complete'));
    assert.equal(taskAttemptCounter, 1);
  });

  run(() => {
    taskAttemptCounter = 0;

    enable();
    assert.ok(isEnabled(), "expected retryablity to be enabled");

    obj.get('doStuff').perform().catch((e) => assert.equal(e.message, 'I will never complete'));
  });

  later(() => {
    assert.equal(taskAttemptCounter, 4);

    done();
  }, 650);
});
