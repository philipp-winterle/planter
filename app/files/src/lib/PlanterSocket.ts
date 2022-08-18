const PORT = process.env.GATSBY_WEBSOCKET_PORT ?? null;
const RECONNECT_TIMEOUT = 1000;

class PlanterSocket {
  ws: WebSocket;
  messageSubs: Array<Function> = [];

  constructor() {
    this.ws = this.connect();
  }

  connect(): WebSocket {
    if (!this.ws) {
      const host = `ws://${window.location.hostname}:${PORT}`;
      const ws = new WebSocket(host);

      ws.onopen = (event) => {
        console.log("Connection established");
      };

      ws.onclose = (event) => {
        console.log("Socket is closed. Reconnect will be attempted in 1 second.", event.code, event.reason);
        setTimeout(() => {
          this.connect();
        }, RECONNECT_TIMEOUT);
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          for (const subCallback of this.messageSubs) {
            subCallback(data);
          }
        } catch (err: any) {
          throw new Error(err);
        }
      };

      ws.onerror = (err: any) => {
        console.error("Socket encountered error: ", err.message, "Closing socket");
        ws.close();
      };

      return ws;
    }

    return this.ws;
  }

  onClose(callback: Function) {
    this.ws.onclose = (event) => {
      callback(event);
    };
  }

  onOpen(callback: Function) {
    this.ws.onopen = (event) => {
      callback(event);
    };
  }

  onError(callback: Function) {
    this.ws.onclose = (event) => {
      callback(event);
    };
  }

  onMessage(callback: Function) {
    if (!this.messageSubs.includes(callback)) {
      this.messageSubs.push(callback);
    }
  }

  close() {
    this.ws.close();
  }
}

export default PlanterSocket;
