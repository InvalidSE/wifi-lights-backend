var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var wss = expressWs.getWss();

app.post("/", (req, res) => {
  if(wss.clients.size > 0) {

    colour = req.query.colour;
    mode = req.query.mode;

    if(colour == undefined || mode == undefined) {
      res.send("Invalid request");
      return;
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          client.send(JSON.stringify(
            {
              colour: colour,
              mode: mode
            }
          ));
        }
    });
  } else {
    res.send("No clients connected");
  }
});

app.get("/connected", (req, res) => {
  res.send(JSON.stringify(
    {
      active: wss.clients.size
    }
  ));
});

app.ws("/", function (ws, req) {
  ws.on("message", function (msg) {
    console.log("Received: ", msg);
  });
});

console.log("Hosted: http://localhost:3000/")
app.listen(3000);