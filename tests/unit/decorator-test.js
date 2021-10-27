import { setOwner } from '@ember/application';
import { module, test } from 'qunit';
import { task } from 'ember-concurrency';
import { DelayPolicy } from 'ember-concurrency-retryable';

module('Unit: decorator use', function () {
  test('retryable can be used via Task decorator', async function (assert) {
    assert.expect(2);

    const DELAY_MS = 100;
    let taskAttemptCounter = 0;

    const delayPolicy = new DelayPolicy({ delay: [DELAY_MS, DELAY_MS] });

    class Obj {
      @task({ retryable: delayPolicy }) *doStuff() {
        taskAttemptCounter++;

        yield 'stuff happened';
      }
    }

    let obj = new Obj();
    setOwner(obj, this.owner);

    assert.equal(taskAttemptCounter, 0);
    await obj.doStuff.perform();
    assert.equal(taskAttemptCounter, 1);
  });
});
