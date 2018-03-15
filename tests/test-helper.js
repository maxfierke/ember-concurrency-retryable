import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import defineModifier from 'ember-concurrency-retryable/define-modifier';

defineModifier();

setApplication(Application.create(config.APP));

start();
