const http = require("http");
const { ExpressPeerServer } = require("peer");

const PeerPort = 8080;
const server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello world!");
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true,
});

const startPeer = () => {
  server.listen(PeerPort, () => {
    console.log(`PeerJS server running on port ${PeerPort}`);
  });
};

// start beyond basic peer server to allow receiving data from client 

module.exports = {
  peerServer,
  startPeer,
};
