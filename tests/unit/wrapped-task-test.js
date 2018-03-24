import { run, later } from '@ember/runloop';
import { Promise } from 'rsvp';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency';
import { module, test } from 'qunit';
import { retryable, DelayPolicy } from 'ember-concurrency-retryable';

module('Unit: wrapped task use');

test("`TaskProperty`s can be extended as retryable by wrapping the task", function(assert) {
  assert.expect(6);

  const DELAY_MS = 100;
  const done = assert.async(1);
  let taskAttemptCounter = 0;

  const delayPolicy = new DelayPolicy({ delay: [DELAY_MS, DELAY_MS] });

  let Obj = EmberObject.extend({
    doStuff: retryable(task(function * () {
      taskAttemptCounter++;

      if (taskAttemptCounter <= 2 || taskAttemptCounter > 4) {
        yield Promise.resolve('stuff happened');
      } else {
        throw new Error('solar flare interrupted stuff');
      }
    }), delayPolicy)
  });

  let obj;

  assert.equal(taskAttemptCounter, 0);

  run(() => {
    obj = Obj.create();
    obj.get('doStuff').perform();
    assert.equal(taskAttemptCounter, 1);
  });


  run(() => {
    obj.get('doStuff').perform();

    assert.equal(taskAttemptCounter, 2);
  });

  run(() => {
    obj.get('doStuff').perform();
    assert.equal(taskAttemptCounter, 3);

    later(() => {
      assert.equal(taskAttemptCounter, 5);

      obj.get('doStuff').perform();
      assert.equal(taskAttemptCounter, 6);
      done();
    }, (DELAY_MS * 2) + 10);
  });
});
