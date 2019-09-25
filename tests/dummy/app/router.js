import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('docs', function() {
    this.route('usage');
    this.route('motivation');
    this.route('retry-policies');
    this.route('events');
    this.route('looping-tasks');
    this.route('testing');
    this.route('api', function() {
      this.route('item', { path: '/*path' });
    });
  });
  this.route('not-found', { path: '/*path' });
});

export default Router;
