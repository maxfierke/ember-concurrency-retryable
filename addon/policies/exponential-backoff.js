import { assert } from '@ember/debug';
import DelayPolicy from "./delay";

function buildIntervals(multiplier, minDelay, maxDelay) {
  let currentInterval = minDelay;
  const intervals = [];

  do {
    intervals.push(currentInterval);
    currentInterval = currentInterval * multiplier;
  } while(currentInterval <= maxDelay);

  intervals.push(maxDelay);

  return intervals;
}

export default class ExponentialBackoffPolicy extends DelayPolicy {
  constructor({ multiplier = 2, minDelay = 50, maxDelay = 500, reasons = [] }) {
    assert("The `multiplier` argument must be a Number", typeof multiplier === 'number');
    assert("The `minDelay` argument must be a Number", typeof minDelay === 'number');
    assert("The `maxDelay` argument must be a Number", typeof maxDelay === 'number');

    const delay = buildIntervals(multiplier, minDelay, maxDelay);
    super({ delay, reasons });
  }
}
