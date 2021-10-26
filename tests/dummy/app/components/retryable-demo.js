// BEGIN-SNIPPET retryable-demo.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { addListener, removeListener, sendEvent } from '@ember/object/events';
import { task, timeout } from 'ember-concurrency';
import { ExponentialBackoffPolicy } from 'ember-concurrency-retryable';

const COLORS = ['blue', 'pink', 'darkred', 'red', 'teal'];
const backoffPolicy = new ExponentialBackoffPolicy({
  multiplier: 1.5,
  minDelay: 30,
  maxDelay: 400,
});

export default class RetryableDemoComponent extends Component {
  @task({
    enqueue: true,
    maxConcurrency: 3,
    evented: true,
    retryable: backoffPolicy,
  })
  *ajaxTask() {
    // simulate slow & unreliable AJAX
    const ms = 2000 + 2000 * Math.random();
    yield timeout(ms);

    if (parseInt(ms) % 7 === 0) {
      throw new Error('Unexpected matrix glitch');
    }
    return {};
  }

  // Boring demo setup stuff below ...

  onAjaxTaskStarted(taskInstance) {
    const [id] = taskInstance.args;
    this.log(COLORS[id], `Task ${id}: making AJAX request`);
  }

  onAjaxTaskRetrying(taskInstance, retryInstance) {
    const [id] = taskInstance.args;
    const retryCount = retryInstance.retryCount;
    this.log(COLORS[id], `Task ${id}: retrying request (${retryCount})`);
  }

  onAjaxTaskRetried(taskInstance, retryInstance) {
    const [id] = taskInstance.args;
    const retryCount = retryInstance.retryCount;
    this.log(
      COLORS[id],
      `Task ${id}: request succeeded after ${retryCount + 1} tries`
    );
  }

  onAjaxTaskSucceeded(taskInstance) {
    const [id] = taskInstance.args;
    this.log(COLORS[id], `Task ${id}: AJAX done`);
  }

  onAjaxTaskErrored(taskInstance, error) {
    const [id] = taskInstance.args;
    this.log(
      COLORS[id],
      `Task ${id}: AJAX failed because of '${error.message}'`
    );
  }

  @task({ on: 'init' }) task0 = loopingAjaxTask(0);
  @task({ on: 'init' }) task1 = loopingAjaxTask(1);
  @task({ on: 'init' }) task2 = loopingAjaxTask(2);
  @task({ on: 'init' }) task3 = loopingAjaxTask(3);
  @task({ on: 'init' }) task4 = loopingAjaxTask(4);

  @tracked logs = null;

  log(color, message) {
    let logs = this.logs || [];
    logs.push({ color, message });
    this.logs = logs.slice(-7);
  }

  trigger(eventName, ...data) {
    return sendEvent(this, eventName, data);
  }

  constructor() {
    super(...arguments);

    addListener(this, 'ajaxTask:started', this, this.onAjaxTaskStarted);
    addListener(this, 'ajaxTask:retrying', this, this.onAjaxTaskRetrying);
    addListener(this, 'ajaxTask:retried', this, this.onAjaxTaskRetried);
    addListener(this, 'ajaxTask:succeeded', this, this.onAjaxTaskSucceeded);
    addListener(this, 'ajaxTask:errored', this, this.onAjaxTaskErrored);

    registerDestructor(this, () => {
      removeListener(this, 'ajaxTask:started', this, this.onAjaxTaskStarted);
      removeListener(this, 'ajaxTask:retrying', this, this.onAjaxTaskRetrying);
      removeListener(this, 'ajaxTask:retried', this, this.onAjaxTaskRetried);
      removeListener(
        this,
        'ajaxTask:succeeded',
        this,
        this.onAjaxTaskSucceeded
      );
      removeListener(this, 'ajaxTask:errored', this, this.onAjaxTaskErrored);
    });

    this.trigger('init');
  }
}

function loopingAjaxTask(id) {
  return function* () {
    while (true) {
      try {
        yield this.ajaxTask.perform(id);
      } catch (e) {
        // Ignoring AJAX failures because we're being naughty.
      }
      yield timeout(2000);
    }
  };
}
// END-SNIPPET
