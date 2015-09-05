var self = module.exports = {
  publish: function(handler, event, context, callback) {
    var webhook = require("./webhook_request.js");
    var config = require("./config.js");

    var request = self.request(config.graphite);
    var data = self[handler](event, context)

    webhook.publish(JSON.stringify(data), request, context, callback);
  },

  request: function(config) {
    var https = require("https");

    var req = {
      proto: https,
      port: config.api_port,
      host: config.api_host,
      path: config.api_path,
      method: "post",
      headers: {
        "X-Graphite-Token": config.token,
      }
    }

    return req;
  },

  // handles notifications from the Jenkins Notification Plugin
  jenkinsNotification: function(event) {
    var result = {
      what: "jenkins_job"
    };

    if (event.build.phase == "STARTED") {
      result.tags = [event.name, event.build.phase].join(",")
    } else {
      result.tags = [event.name, event.build.phase, event.build.status].join(",")
    }

    return result;
  },

  // handles a event created from a puppet report handler like:
  //
  //   data = self.raw_summary
  //   data["host"] = self.host
  //   data["status"] = self.status
  //   data["log_count"] = self.logs.size
  puppetReport: function(event) {
    var tags = [event.host, event.status];

    if (event.events.failure > 0) {
      tags.push("failed_resources")
    }

    var result = {
      what: "puppet_report",
      tags: tags.join(",")
    };

    return result;
  },

  // {"hostname": "example.net"}
  rebootPushNotification: function(event) {
    var result = {
      what: "reboot",
      tags: event.hostname
    };

    return result;
  },

  gitHubPushNotification: function(event) {
    var result = {
      what: "github_push",
      tags: [event.repository.full_name, event.pusher.name].join(",")
    };

    return result;
  },

  gogsPushNotification: function(event) {
    var tags = [];

    tags.push(event.repository.owner.username + "/" + event.repository.name);
    tags.push(event.pusher.username)

    var result = {
      what: "gogs_push",
      tags: tags.join(",")
    };

    return result;
  },

  quayPushNotification: function(event) {
    var tags = [event.repository];

    tags.concat(Object.keys(event.updated_tags));

    var result = {
      what: "quay_push",
      tags: tags.join(",")
    };

    return result;
  }
}
