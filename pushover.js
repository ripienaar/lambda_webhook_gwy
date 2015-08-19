var self = module.exports = {
  publish: function(handler, event, context, callback) {
    var webhook = require("./webhook_request.js");
    var querystring = require('querystring');
    var config = require("./config.js");

    var request = self.request(config.pushover);
    var message = self[handler](event, context)

    var data = querystring.stringify({
      token: config.pushover.token,
      user: config.pushover.user,
      sound: config.pushover.sound,
      message: message
    });

    webhook.publish(data, request, context, callback);
  },

  request: function(config) {
    var https = require("https");

    var req = {
      proto: https,
      port: config.api_port,
      host: config.api_host,
      path: config.api_path,
      method: "post"
    }

    return req;
  },

  // handles a event created from a puppet report handler like:
  //
  //   data = self.raw_summary
  //   data["host"] = self.host
  //   data["status"] = self.status
  //   data["log_count"] = self.logs.size
  puppetReport: function(event) {
    return "puppet run: host: " + event.host + " status: " + event.status;
  },

  // {"hostname": "example.net"}
  rebootPushNotification: function(event) {
    return("reboot: host: " + event.hostname)
  },

  quayPushNotification: function(event) {
    return("quay push: repo: " + event.repository)
  }
}
