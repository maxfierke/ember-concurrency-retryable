import { setOwner } from '@ember/application';
import { module, test } from 'qunit';
import { task as taskDecorator } from 'ember-concurrency';
import { task as legacyTaskDecorator } from 'ember-concurrency-decorators';
import { DelayPolicy } from 'ember-concurrency-retryable';
import { dependencySatisfies } from '@embroider/macros';

const task = dependencySatisfies('ember-concurrency', '^2.0.0-rc.1')
  ? taskDecorator
  : legacyTaskDecorator;

module('Unit: decorator use', function() {
  test("retryable can be used via Task decorator", async function(assert) {
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
