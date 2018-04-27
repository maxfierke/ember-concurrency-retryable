# ember-concurrency-retryable

[![Build Status](https://travis-ci.org/maxfierke/ember-concurrency-retryable.svg?branch=master)](https://travis-ci.org/maxfierke/ember-concurrency-retryable)
[![npm version](https://badge.fury.io/js/ember-concurrency-retryable.svg)](https://badge.fury.io/js/ember-concurrency-retryable)
[![Ember Observer Score](https://emberobserver.com/badges/ember-concurrency-retryable.svg)](https://emberobserver.com/addons/ember-concurrency-retryable)

An Ember addon that adds retry strategies and a task modifier for automatically
retrying [ember-concurrency](https://github.com/machty/ember-concurrency) tasks.

## Installation

```
ember install ember-concurrency-retryable
```

## Documentation

[https://maxfierke.github.io/ember-concurrency-retryable](https://maxfierke.github.io/ember-concurrency-retryable)

## Contributing

* Working on something?
  * Open a PR with tests for what you're implementing or fixing
    * Open with `[WIP]` in the title and tag me if you want to start a
      conversation!

* Experiencing troubles?
  * Open an issue
  * Reach out to me on the [Ember.js Community Slack](https://embercommunity.slack.com/).
    You can find me as **@maxfierke** on there.
    (I caution that I do not scale)

### Installation

* `git clone git@github.com:maxfierke/ember-concurrency-retryable.git`
* `cd ember-concurrency-retryable`
* `yarn install`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `yarn test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [MIT License](LICENSE.md).

## Thanks

* [Ben Demboski](https://github.com/bendemboski) for [`ember-concurrency-test-waiter`](https://github.com/bendemboski/ember-concurrency-test-waiter) from which this addon approach is based.
* [Devin Weaver](https://github.com/sukima) for providing great feedback on my original ember-concurrency [RFC for retryable tasks](https://github.com/machty/ember-concurrency/issues/183).
