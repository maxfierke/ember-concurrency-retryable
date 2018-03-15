import { run, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';

module('Unit: task retrying');

test("`TaskProperty`s can be extended with a retry policy", function(assert) {
  assert.expect(6);

  const DELAY_MS = 100;
  const done = assert.async(1);
  let taskAttemptCounter = 0;

  const delayPolicy = new DelayPolicy({ delay: [DELAY_MS, DELAY_MS] });

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
    //assert.notOk(obj.get('doStuff.last.isRetrying'), 'expect not to have started retrying');
  });


  run(() => {
    obj.get('doStuff').perform();

    assert.equal(taskAttemptCounter, 2);
    //assert.notOk(obj.get('doStuff.last.isRetrying'), 'expect not to have started retrying');
  });

  run(() => {
    obj.get('doStuff').perform();
    assert.equal(taskAttemptCounter, 3);
    //assert.ok(obj.get('doStuff.last.isRetrying'), 'expect to have started retrying');

    later(() => {
      assert.equal(taskAttemptCounter, 5);
      //assert.notOk(obj.get('doStuff.last.isRetrying'), 'expect to no longer be marked as retrying');
      //assert.equal(obj.get('doStuff.last.retryCount'), 2);

      obj.get('doStuff').perform();
      assert.equal(taskAttemptCounter, 6);
      done();
    }, (DELAY_MS * 2) + 10);
  });
});
