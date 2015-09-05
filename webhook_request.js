module.exports = {
  publish: function(data, request, context, callback) {
    if (request.headers != undefined) {
      request.headers["Content-Length"] = data.length
    };

    var req = request.proto.request(request, function(result) {
      if (result.statusCode == 200) {
        console.log(request.host + " GOT 200");
        if (context != null) {
          context.succeed("ok");
          context.done();
        } else if (callback != null) {
          callback();
        }
      }

      result.on("data", function(chunk){
        if (result.statusCode != 200) {
          console.log(request.host + " ANSWER: " + chunk);

          if (context != null) {
            context.done("ok");
            context.done();
          } else if (callback != null) {
            callback();
          }
        }
      });
    });

    req.on("error", function (err) {
      console.log(request.host + " REACHED ERROR EVENT");
      if (context != null) {
        context.fail(err);
      } else if (callback != null) {
        callback(err);
      }
    });

    console.log(request.host + " SENDING: " + data);
    console.log(request);
    req.write(data);
    req.end();
  }
}
