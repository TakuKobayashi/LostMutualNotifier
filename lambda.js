var LineBot = require(__dirname + '/linebot.js');

var callLambdaResponse = function (promise, context) {
  promise.then((response) => {
    var lambdaResponse = {
      statusCode: 200,
      headers: {
        "X-Line-Status": "OK"
      },
      body: JSON.stringify({
        "result": "completed"
      })
    };
    context.succeed(lambdaResponse);
  }).catch(function (err) {
    console.log(err);
  });
}

exports.handler = async function (event, context) {
  console.log(JSON.stringify(event));
  var linebot = new LineBot(process.env.ACCESSTOKEN);
  var lineClient = linebot.lineClient;
  event.events.forEach(function (lineMessage) {
    if (lineMessage.type == "follow") {
      callLambdaResponse(linebot.follow(lineMessage.source.userId, lineMessage.timestamp), context);
    } else if (lineMessage.type == "unfollow") {
      callLambdaResponse(linebot.unfollow(lineMessage.source.userId, lineMessage.timestamp), context);
    } else if (lineMessage.type == "postback") {
      var receiveData = JSON.parse(lineMessage.postback.data);
      console.log(receiveData);
    } else if (lineMessage.type == "message") {
    }
  });
};