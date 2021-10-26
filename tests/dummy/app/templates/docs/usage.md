# Usage

```
ember install ember-concurrency-retryable
```

Through the magic of `registerModifier`, `ember-concurrency-retryable` registers
a `retryable` modifier when imported, which will allow attaching a retry policy
and retryable behavior to your tasks. Just be sure to import somewhere early
in the boot process, such as `app.js` or in an initializer, or anywhere before
defining a task using it.

```javascript
// app.js
import 'ember-concurrency-retryable';

// remainder of app.js...
```

```javascript
// components/flaky-component.js
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { DelayPolicy } from 'ember-concurrency-retryable';
import getWidgetsFromFlakyApi from '../utils/get-widgets';
import UnavailableError from '../utils/errors/unavailable';

const myDelayPolicy = new DelayPolicy({
  delay: [300, 600, 1200, 2400],
  reasons: [UnavailableError]
});

export default class FlakyComponent extends Component {
  @task({ retryable: myDelayPolicy })
  *myTask() {
    return yield getWidgetsFromFlakyApi();
  }
}
```
