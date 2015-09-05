var graphite = require("./graphite.js");
var pushover = require("./pushover.js");
var async = require("async");

var async_publish = function(handler, backends, event, context) {
  var tasks = [];

  backends.forEach(function(backend) {
    tasks.push(function(callback) {
      backend.publish(handler, event, null, callback);
    });
  });

  async.parallel(tasks, function(err, results) {
    if (err) {
      context.fail(err);
    } else {
      context.succeed("ok");
    }
  });
}

exports.handleJenkinsNotification = function(event, context) {
  if (event.build.phase != "FINALIZED") {
    graphite.publish("jenkinsNotification", event, context);
  } else {
    context.succeed("ok");
    context.done();
  }
}

exports.handlePuppetReports = function(event, context) {
  async_publish("puppetReport", [graphite, pushover], event, context);
}

exports.handleRebootPushNotifications = function(event, context) {
  async_publish("rebootPushNotification", [graphite, pushover], event, context);
}

exports.handleGitHubPushNotifications = function(event, context) {
  graphite.publish("gitHubPushNotification", event, context);
}

exports.handleGogsPushNotifications = function(event, context) {
  graphite.publish("gogsPushNotification", event, context);
}

exports.handleQuayPushNotifications = function(event, context) {
  graphite.publish("quayPushNotification", event, context);
};
