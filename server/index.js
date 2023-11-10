const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const path = require('path');
var expressWs = require('express-ws');
var expressWs = expressWs(express());
var app = expressWs.app;

app.use(express.static(path.resolve(__dirname, "..", "app")));
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "app", "index.html"));
});

var aWss = expressWs.getWss('/');

app.ws('/', (ws, req) => {
  ws.on('message', function incoming(message) {
    // console.log(message);
    aWss.clients.forEach(function (client) {
      client.send(message);
    });
  });
});

app.listen(3000);