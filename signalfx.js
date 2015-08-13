module.exports = {
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

  gitHubPushNotification: function(event) {
    var result = {
      eventType: "github_push",
      dimensions: {
        repository_name: event.repository.full_name,
        repository_ref: event.ref,
        head_commit: event.head_commit.id,
        commits: event.commits.length.toString(),
        author: event.pusher.name,
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
        commits: event.commits.length.toString(),
        author: event.pusher.username,
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
        namespace: event.namespace,
        image_tags: Object.keys(event.updated_tags).join(", ")
      }
    };

    return result;
  }
}
