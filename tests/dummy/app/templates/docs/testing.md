# Testing

Depending on your policy settings, when testing failure cases `ember-concurrency-retryable` might get in the way of your async test timeout settings. Because of this, `ember-concurrency-retryable` provides a switch for disabling it that you may use in these circumstances.

```javascript
// tests/unit/something-test.js
import {
  enable as enableTaskRetries,
  disable as disableTaskRetries
} from 'ember-concurrency-retryable';

test('testing some failure case', function (assert) {
  enableTaskRetries();

  // ...test that some task fails and throws an error...

  disableTaskRetries();
});
```

**Ensure you call `enable` again if you rely on `ember-concurrency-retryable` working in other contexts.** This strategy for testing leaves a bit to be desired, so I'd like to investigate other strategies as well. As such, `enable`/`disable` may disappear in favor of something better. For now, it's a helpful escape hatch.

Alternatively, if you export your policies, you may also choose to use a test
double library like [sinon](http://sinonjs.org) to stub out the policy's `shouldRetry` function.


```javascript
// tests/unit/something-test.js
import { MyRadPolicy } from 'app/utils/retryable-policies';
import sinon from 'sinon';
// ... other imports

module('Unit: Something', function (hooks) {
  hooks.afterEach(function() {
    sinon.collection.restore();
  });

  test('testing some failure case', function (assert) {
    sinon.collection.stub(MyRadPolicy, 'shouldRetry').returns(false);

    // ...test that some task fails and throws an error...
  });
});
```
