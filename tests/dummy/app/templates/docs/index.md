# Introduction

[![Build Status](https://travis-ci.org/maxfierke/ember-concurrency-retryable.svg?branch=master)](https://travis-ci.org/maxfierke/ember-concurrency-retryable)
[![npm version](https://badge.fury.io/js/ember-concurrency-retryable.svg)](https://badge.fury.io/js/ember-concurrency-retryable)
[![Ember Observer Score](https://emberobserver.com/badges/ember-concurrency-retryable.svg)](https://emberobserver.com/addons/ember-concurrency-retryable)

An Ember addon that adds retry strategies and a task modifier for automatically
retrying [ember-concurrency](https://github.com/machty/ember-concurrency) tasks.

## Motivation

As long as web apps need a network, network errors will exist. Sometimes
they're blips. In the case of mobile internet, intermittent network errors are
just part of the reality of distributed connectivity. There are many use cases
where user intervention should not be required for recovery from boring,
routine network blips, API failures, etc.

Some use-cases for automatic retrying of tasks:

* Long-polling tasks
    * Background auto-saves
* Telemetry/analytics
* Integrations w/ 3rd party APIs that don't quite have five 9s (or three)
* Applications that deal with periodic resource contention
    * e.g. app talks to a cloud storage API in files might be *locked* for a
      few seconds while some other system is working on it.
* Anything async that is prone to *transient failure*
    * e.g. Geolocation API failures while a mobile user is in transit

This work comes out of [an RFC](https://github.com/machty/ember-concurrency/issues/183) opened against `ember-concurrency` a while ago.
After discussion on the RFC, it seemed like it would be best to implement this
functionality via an addon, to allow for experimentation and refinement.

## How does it work?

`retryable` works by wrapping a `task`'s generator function in a
try/catch and transparently retrying the generator function in accordance with
the passed in retry policy. `ember-concurrency-retryable` uses generator
functions and `ember-concurrency` primatives like `timeout` so that it plays
along nicely with `ember-concurrency` like any other task, and remains fully
cancelable.
