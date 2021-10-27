# Changelog

### 1.0.0

#### Breaking changes

- Drop support for ember-concurrency < 2.2.0
- Drop support for Node 10 (EOL)
- Drop support for < 3.16
- Drop support for wrapping tasks with `retryable`.
  Must use `retryable` via decorator or `.retryable()` on classic tasks.

### 0.9.1
- Support ember-concurrency 2.0.0-rc.1 and 2.0.0-rc.2

### 0.9.0
- Support ember-concurrency v2 (in beta)
- Removed deprecated `enable` and `disable` test helpers. Use `enableTaskRetries` and `disableTaskRetries`, respectively, instead.

### 0.8.0
- Drop Node 8
- Remove unneeded `ember-cli-htmlbars` dependency

### 0.7.0

- Resets `retryCount` and `lastError` after task instance successfully retries.
  * **Potentially breaking** if you're accessing these properties outside of the
  context of a retry event or retry policy hook, but this is not really supported.
- Add `retriedSignal` yieldable for manually designating when a looping task
  has successfully retried. See documentation page on "Looping Tasks" for more
  details and caveats.
- Added `enableTaskRetries` and `disableTaskRetries` helper functions for
  testing. Deprecated `disable` and `enable`.
- Depends on ember-concurrency 1.0.0+

### 0.6.0
- Fixes an off-by-one bug in the default `DelayPolicy`, which also affects
  `ExponentialBackoffPolicy`. May be a **potential breaking change** for
  consumers of either class. The bug skipped the first delay and ended the
  policy by going over, effectively causing the last delay to be 1ms.

### 0.5.0
- Bumped `ember-cli-babel` dependency to the 7.x series.
- Dropped support for ember-cli < 2.18

### 0.4.0

#### Features
- Added `retrying` and `retried` events for tasks using `.evented()` modifier

#### Bugfixes
- Fixed a bug where `didRetry` would be called multiple times for a task instance.

#### Documentation
- Moved docs from README to GitHub Pages

### 0.3.1

- Added `didError` and `didRetry` hooks

### 0.3.0

- Added `willRetry` hook to retry policies
- Fixed typo in `defineModifier` export from module root.

### 0.2.0

- Initial Release
