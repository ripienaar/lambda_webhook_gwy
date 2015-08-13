module.exports = {
  publish: function(data, request, context) {
    var req = request.proto.request(request, function(result) {
      result.on("data", function(chunk){
        console.log("ANSWER: " + chunk);
        context.succeed("ok");
      });
    });

    req.on("error", function (err) {
      context.fail(err);
    });

    console.log(JSON.stringify(data));
    req.write(JSON.stringify(data));
    req.end();
  }
}
