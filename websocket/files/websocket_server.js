import WebSocket, { WebSocketServer } from "ws";
import webhookService from "./webhook_server.js";

const PORT = process.env.WEBSOCKET_PORT || 55556;

const wss = new WebSocketServer({
  port: PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

wss.on("listening", () => {
  console.log("Server running at PORT " + PORT);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // Websocket Client sends a message to the wss
  ws.on("message", (data) => {
    console.log("received: %s", data);
  });
});

// Broadcast message to all clients
webhookService.onUpdate(({ type, target }) => {
  console.log("UPDATE SEND", type, target);

  wss.clients.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: type,
        target: target,
      })
    );
  });
});

// HEARTBEAT CHECK
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
