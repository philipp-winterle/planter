import React, { useEffect, useState, createContext } from "react";
import PlanterSocket from "../lib/PlanterSocket";

// Constants
const RECONNECT_TIMEOUT = 1000;

// Create initial websocket
const webSocket = new PlanterSocket();

// Export context
export const SocketContext = createContext(webSocket);

export const SocketProvider = (props: React.PropsWithChildren) => {
  const [ws, setWs] = useState(webSocket);

  useEffect(() => {
    const onClose = (event: CloseEvent) => {
      console.log(
        `Socket is closed. Trying to reconnect in ${RECONNECT_TIMEOUT}`,
        event.code,
        event.reason
      );
      setTimeout(() => {
        setWs(new PlanterSocket());
      }, RECONNECT_TIMEOUT);
    };

    ws.onOpen(() => {
      console.log("Connection established");
    });

    ws.onClose(onClose);

    ws.onError((err: Error) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );
      ws.close();
    });

    return () => {
      ws.close();
    };
  }, [ws, setWs]);

  return (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
  );
};
