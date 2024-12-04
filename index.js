var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var wss = expressWs.getWss();

app.post("/", (req, res) => {
  if(wss.clients.size > 0) {

    (r, g, b) = req.query.primary.split(",");
    (r2, g2, b2) = req.query.secondary.split(",");

    mode = req.query.mode;

    if(colour == undefined || mode == undefined) {
      res.send("Invalid request");
      return;
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          client.send(JSON.stringify(
            {
              primary: {
                r: r,
                g: g,
                b: b
              },
              secondary: {
                r: r2,
                g: g2,
                b: b2
              },
              mode: mode
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
  });
});

console.log("Hosted: http://localhost:3000/")
app.listen(3000);