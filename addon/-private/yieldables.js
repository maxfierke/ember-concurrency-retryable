import {
  yieldableSymbol,
  YIELDABLE_CONTINUE
} from 'ember-concurrency/utils';

export const getTaskInstance = {
  [yieldableSymbol](taskInstance, resumeIndex) {
    taskInstance.proceed(resumeIndex, YIELDABLE_CONTINUE, taskInstance);
  }
};
