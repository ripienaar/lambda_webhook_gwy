var self = module.exports = {
  publish: function(handler, event, context, callback) {
    var webhook = require("./webhook_request.js");
    var config = require("./config.js");

    var request = self.request(config.signalfx);
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
        "X-SF-TOKEN": config.token
      }
    }

    return req;
  },

  // handles notifications from the Jenkins Notification Plugin
  jenkinsNotification: function(event) {
    var result = {
      eventType: "jenkins_job",
      dimensions: {
        job: event.name,
        phase: event.build.phase,
        status: event.build.status,
        branch: event.build.scm.branch
      },
      properties: {
        job_number: event.build.number,
        commit: event.build.scm.commit
      }
    };

    return result;
  },

  // handles a event created from a puppet report handler like:
  //
  //   data = self.raw_summary
  //   data["host"] = self.host
  //   data["status"] = self.status
  //   data["log_count"] = self.logs.size
  puppetReport: function(event) {
    var result = {
      eventType: "puppet_report",
      dimensions: {
        host: event.host,
        status: event.status,
        log_messages: event.log_count.toString()
      },
      properties: {
        puppet_version: event.version.puppet,
        config_version: event.version.config,
        success_events: event.events.success.toString(),
        failure_events: event.events.failure.toString(),
        runtime: event.time.total.toString(),
        resource: event.resources.total.toString()
      }
    };

    return result;
  },

  // {"hostname": "example.net"}
  rebootPushNotification: function(event) {
    var result = {
      eventType: "reboot",
      dimensions: {
        host: event.hostname
      }
    };

    return result;
  },

  // any JSON data
  simplePushNotification: function(event) {
    var result = {
      eventType: "simple_test",
      dimensions: {
        test: "true"
      },
      properties: {
        event: JSON.stringify(event)
      }
    };

    return result;
  },

  gitHubPushNotification: function(event) {
    var result = {
      eventType: "github_push",
      dimensions: {
        repository_name: event.repository.full_name,
        repository_ref: event.ref,
        commits: event.commits.length.toString(),
        author: event.pusher.name
      },
      properties: {
        head_commit: event.head_commit.id,
        url: event.compare_url
      }
    };

    return result;
  },

  gogsPushNotification: function(event) {
    var result = {
      eventType: "gogs_push",
      dimensions: {
        repository_name: event.repository.owner.username + "/" + event.repository.name,
        repository_ref: event.ref,
        author: event.pusher.username
      },
      properties: {
        commits: event.commits.length.toString(),
        url: event.compare_url
      }
    };

    return result;
  },

  quayPushNotification: function(event) {
    var result = {
      eventType: "quay_push",
      dimensions: {
        repository: event.repository,
        name: event.name,
        namespace: event.namespace
      },
      properties: {
        image_tags: Object.keys(event.updated_tags).join(", ")
      }
    };

    return result;
  }
}
