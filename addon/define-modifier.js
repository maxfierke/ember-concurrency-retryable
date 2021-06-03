import retryable from './retryable';
import { TaskProperty } from 'ember-concurrency';

/*
 * Define a .retryable() modifier on TaskProperty
 * Woohoo extending private object prototypes!
 */
export default function defineModifier() {
  TaskProperty.prototype.retryable = function (retryPolicy) {
    return retryable(this, retryPolicy);
  };
}
