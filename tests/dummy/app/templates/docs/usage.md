# Usage

```
ember install ember-concurrency-retryable
```

## via wrapping of `task`
`ember-concurrency-retryable` adds a `retryable` function which can wrap an
ember-concurrency `TaskProperty`. You can use the addon via this wrapping
strategy like below:

```javascript
// components/flaky-component.js
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { retryable, DelayPolicy } from 'ember-concurrency-retryable';
import getWidgetsFromFlakyApi from '../utils/get-widgets';
import UnavailableError from '../utils/errors/unavailable';

const myDelayPolicy = new DelayPolicy({
  delay: [300, 600, 1200, 2400],
  reasons: [UnavailableError]
});

export default Component.extend({
  myTask: retryable(task(function*() {
    return yield getWidgetsFromFlakyApi();
  }), myDelayPolicy)
});
```

## via `task` property modifier

The wrapping method above may not look as aesthetically pleasing, so instead, you
may also add a `.retryable` modifier to ember-concurrency tasks through the
magic of reaching into private APIs! `ember-concurrency-retryable` provides a
`defineModifier` function that can be used somewhere early in the boot process,
such as `app.js` or in an initializer, which will add a `retryable` modifier
method to the `TaskProperty` prototype.

```javascript
// app.js
import defineModifier from 'ember-concurrency-retryable/define-modifier';

defineModifier();

// remainder of app.js...
```

```javascript
// components/flaky-component.js
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DelayPolicy from 'ember-concurrency-retryable/policies/delay';
import getWidgetsFromFlakyApi from '../utils/get-widgets';
import UnavailableError from '../utils/errors/unavailable';

const myDelayPolicy = new DelayPolicy({
  delay: [300, 600, 1200, 2400],
  reasons: [UnavailableError]
});

export default Component.extend({
  myTask: task(function*() {
    return yield getWidgetsFromFlakyApi();
  }).retryable(myDelayPolicy)
});
```

Because this relies on accessing `ember-concurrency`'s `TaskProperty` intimate
API and modifying the prototype for that object, it's *not strictly recommended*,
but should be relatively safe to do, as the chances of that API changing
drastically without a suitable replacement is unlikely.
