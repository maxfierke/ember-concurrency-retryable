# ember-concurrency-retryable

[![Build Status](https://github.com/maxfierke/ember-concurrency-retryable/actions/workflows/ci.yml/badge.svg)](https://github.com/maxfierke/ember-concurrency-retryable/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ember-concurrency-retryable.svg)](https://badge.fury.io/js/ember-concurrency-retryable)
[![Ember Observer Score](https://emberobserver.com/badges/ember-concurrency-retryable.svg)](https://emberobserver.com/addons/ember-concurrency-retryable)

An Ember addon that adds retry strategies and a task modifier for automatically
retrying [ember-concurrency](https://github.com/machty/ember-concurrency) tasks.

## Compatibility

* Ember.js v3.16 or above
* Ember CLI v3.16 or above
* ember-concurrency 2.2.0+

## Installation

```
ember install ember-concurrency-retryable
```

## Documentation

[https://maxfierke.github.io/ember-concurrency-retryable](https://maxfierke.github.io/ember-concurrency-retryable)

## Contributing / Reporting Issues

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Thanks

* [Ben Demboski](https://github.com/bendemboski) for [`ember-concurrency-test-waiter`](https://github.com/bendemboski/ember-concurrency-test-waiter) from which this addon approach is based.
* [Devin Weaver](https://github.com/sukima) for providing great feedback on my original ember-concurrency [RFC for retryable tasks](https://github.com/machty/ember-concurrency/issues/183).
