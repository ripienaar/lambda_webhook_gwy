var signalfx = require("./signalfx.js");
var webhook = require("./webhook_request.js");
var config = require("./config.js");

var publish = function(sfx_event, context) {
  var sfx_request = signalfx.request(config.signalfx);

  webhook.publish(sfx_event, sfx_request, context);
};

exports.handleGitHubPushNotifications = function(event, context) {
  publish(signalfx.gitHubPushNotification(event), context);
}

exports.handleGogsPushNotifications = function(event, context) {
  publish(signalfx.gogsPushNotification(event), context);
}

exports.handleQuayPushNotifications = function(event, context) {
  publish(signalfx.quayPushNotification(event), context);
};
