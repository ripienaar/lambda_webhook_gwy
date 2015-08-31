var signalfx = require("./signalfx.js");
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
    signalfx.publish("jenkinsNotification", event, context);
  }
}

exports.handlePuppetReports = function(event, context) {
  async_publish("puppetReport", [signalfx, pushover], event, context);
}

exports.handleRebootPushNotifications = function(event, context) {
  async_publish("rebootPushNotification", [signalfx, pushover], event, context);
}

exports.handleGitHubPushNotifications = function(event, context) {
  signalfx.publish("gitHubPushNotification", event, context);
}

exports.handleGogsPushNotifications = function(event, context) {
  signalfx.publish("gogsPushNotification", event, context);
}

exports.handleQuayPushNotifications = function(event, context) {
  signalfx.publish("quayPushNotification", event, context);
};

exports.handleSimplePushNotifications = function(event, context) {
  signalfx.publish("simplePushNotification", event, context);
};
