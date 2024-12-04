var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var wss = expressWs.getWss();

app.post("/", (req, res) => {
  if(wss.clients.size > 0) {

    primary = req.query.primary.split(" ");
    secondary = req.query.secondary.split(" ");

    mode = req.query.mode;

    if(primary == undefined || mode == undefined || secondary == undefined) {
      res.send("Invalid request");
      return;
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          client.send(JSON.stringify(
            {
              primary: {
                r: primary[0],
                g: primary[1],
                b: primary[2]
              },
              secondary: {
                r: secondary[0],
                g: secondary[1],
                b: secondary[2]
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