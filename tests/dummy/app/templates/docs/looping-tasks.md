# Looping Tasks

For looping tasks (e.g. those with `while(true) { ... }`), if the task is retried
successfully, the next time it fails, it will only be retried if there are
available delays left in the policy (in the context of `DelayPolicy`-based policies).
This is counter-intuitive and ideally, successfully retrying the task would
clear the slate.

Currently, looping tasks hit a version of [the halting problem](https://en.wikipedia.org/wiki/Halting_problem).
There's no way for ember-concurrency-retryable to know whether the task
successfully retried, unless it returns (and since it's an infinite loop, it does not.)

To address this problem, ember-concurrency-retryable provides an escape-hatch in
the form of a [Yieldable](http://ember-concurrency.com/docs/yieldables) called
`retriedSignal`. You can `yield` this at the bottom of your loop to indicate to
ember-concurrency-retryable that the task body has been completed, and should be
considered "retried".

*Note*: This is the **only** supported use-case for `retriedSignal`. Any other
use may result in undefined behavior. Please exercise caution when using this
library-sanctioned leaky abstraction.

```javascript
// components/flaky-component.js
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { DelayPolicy, retriedSignal } from 'ember-concurrency-retryable';
import getWidgetsFromFlakyApi from '../utils/get-widgets';
import UnavailableError from '../utils/errors/unavailable';

const myDelayPolicy = new DelayPolicy({
  delay: [300, 600, 1200, 2400],
  reasons: [UnavailableError]
});

export default class LoopingTaskComponent extends Component {
  @service widgetStore;

  constructor() {
    super(...arguments);
    this.widgetPoll.perform();
  }

  @task({ retryable: myDelayPolicy })
  *widgetPoll() {
    while(true) {
      const widgets = yield getWidgetsFromFlakyApi();
      this.widgetStore.setWidgets(widgets);
      yield timeout(10000);

      yield retriedSignal;
    }
  }
}
```
