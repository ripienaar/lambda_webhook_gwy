module.exports = {
  publish: function(data, request, context, callback) {
    var req = request.proto.request(request, function(result) {
      result.on("data", function(chunk){
        console.log("ANSWER: " + chunk);

        if (context != null) {
          context.succeed("ok");
        } else if (callback != null) {
          callback();
        }
      });
    });

    req.on("error", function (err) {
        if (context != null) {
          context.fail(err);
        } else if (callback != null) {
          callback(err);
        }
    });

    console.log("SENDING: " + data);
    req.write(data);
    req.end();
  }
}
