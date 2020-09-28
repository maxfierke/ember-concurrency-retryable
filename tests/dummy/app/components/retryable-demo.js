import defineModifier from 'ember-concurrency-retryable/define-modifier';
defineModifier();

/* eslint-disable ember/no-on-calls-in-components */

// BEGIN-SNIPPET retryable-demo.js
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import {
  task,
  timeout
} from 'ember-concurrency';
import ExponentialBackoffPolicy from 'ember-concurrency-retryable/policies/exponential-backoff';

const COLORS = ['blue', 'pink', 'darkred', 'red', 'teal'];
const backoffPolicy = new ExponentialBackoffPolicy({
  multiplier: 1.5,
  minDelay: 30,
  maxDelay: 400
});

export default Component.extend({
  ajaxTask: task(function * () {
    // simulate slow & unreliable AJAX
    const ms = 2000 + 2000 * Math.random();
    yield timeout(ms);

    if (parseInt(ms) % 7 === 0) {
      throw new Error("Unexpected matrix glitch");
    }
    return {};
  }).enqueue().maxConcurrency(3).evented().retryable(backoffPolicy),

  ajaxTaskStarted: on('ajaxTask:started', function(taskInstance) {
    const [id] = taskInstance.args;
    this.log(COLORS[id], `Task ${id}: making AJAX request`);
  }),

  ajaxTaskRetrying: on('ajaxTask:retrying', function (taskInstance, retryInstance) {
    const [id] = taskInstance.args;
    const retryCount = retryInstance.retryCount;
    this.log(COLORS[id], `Task ${id}: retrying request (${retryCount})`);
  }),

  ajaxTaskRetried: on('ajaxTask:retried', function (taskInstance, retryInstance) {
    const [id] = taskInstance.args;
    const retryCount = retryInstance.retryCount;
    this.log(COLORS[id], `Task ${id}: request succeeded after ${retryCount+1} tries`);
  }),

  ajaxTaskSucceeded: on('ajaxTask:succeeded', function(taskInstance) {
    const [id] = taskInstance.args;
    this.log(COLORS[id], `Task ${id}: AJAX done`);
  }),

  ajaxTaskErrored: on('ajaxTask:errored', function(taskInstance, error) {
    const [id] = taskInstance.args;
    this.log(COLORS[id], `Task ${id}: AJAX failed because of '${error.message}'`);
  }),

  task0: loopingAjaxTask(0),
  task1: loopingAjaxTask(1),
  task2: loopingAjaxTask(2),
  task3: loopingAjaxTask(3),
  task4: loopingAjaxTask(4),

  log(color, message) {
    let logs = this.logs || [];
    logs.push({ color, message });
    this.set('logs', logs.slice(-7));
  },

  logs: null,
});

function loopingAjaxTask(id) {
  return task(function * () {
    while (true) {
      try {
        yield this.ajaxTask.perform(id);
      } catch(e) {
        // Ignoring AJAX failures because we're being naughty.
      }
      yield timeout(2000);
    }
  }).on('init');
}
// END-SNIPPET
