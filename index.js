var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var wss = expressWs.getWss();

primary = [0, 0, 0];
secondary = [0, 0, 0];
mode = 0;
brightness = 0;
speed = 1000;

app.post("/set", (req, res) => {
  if(wss.clients.size > 0) {

    // handle mode, primary, secondary, brightness
    if (req.query.primary) {
      primary = req.query.primary.split(" ").map(function (x) { return parseInt(x); });
    }
    if (req.query.secondary) {
      secondary = req.query.secondary.split(" ").map(function (x) { return parseInt(x); });
    }
    if (req.query.mode) {
      mode = parseInt(req.query.mode);
    }
    if (req.query.brightness) {
      brightness = parseInt(req.query.brightness);
    }
    if (req.query.speed) {
      speed = parseInt(req.query.speed);
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          client.send(JSON.stringify(
            {
              primary: primary,
              secondary: secondary,
              mode: mode,
              brightness: brightness,
              speed: speed
            }
          ));
        }
    });

    res.send(JSON.stringify({primary: primary, secondary: secondary, mode: mode, brightness: brightness, speed: speed}));

  } else {
    res.send("No clients connected");
  }
});

app.post("/brightness", (req, res) => {
  if(wss.clients.size > 0) {

    brightness = req.query.brightness;

    if(brightness == undefined) {
      res.send("Invalid request");
      return;
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          client.send(JSON.stringify(
            {
              brightness: parseInt(brightness)
            }
          ));
        }
    });

    res.send("Sent to " + wss.clients.size + " clients");

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
    // update clients with current state
    ws.send(
      JSON.stringify(
      {
        primary: primary,
        secondary: secondary,
        mode: mode,
        brightness: brightness,
        speed: speed
      }
    ));
  });
});

console.log("Hosted: http://localhost:3000/")
app.listen(3000);