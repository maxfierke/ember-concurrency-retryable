# Changelog

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
