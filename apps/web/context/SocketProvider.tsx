"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
   children?: React.ReactNode;
}

interface ISocketContext {
   sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
   const state = useContext(SocketContext);
   if (!state) {
      throw new Error("Socket state is undefined");
   }

   return state;
};

function SocketProvider({ children }: SocketProviderProps) {
   const [socket, setSocket] = useState<Socket>();
   // TODO: dont forget to change the variable type
   const sendMessage: ISocketContext["sendMessage"] = useCallback(
      (msg) => {
         console.log("Send message", msg);
         if (socket) {
            socket.emit("event:message", { message: msg });
         }
      },
      [socket]
   );

   const onMessage = useCallback((msg: string) => {
      console.log("Message received", msg);
   }, []);

   useEffect(() => {
      const _socket = io("http://localhost:8000");
      _socket.on("message", onMessage);
      setSocket(_socket);
      return () => {
         _socket.disconnect();
         _socket.off("message", onMessage);
         setSocket(undefined);
      };
   }, []);

   return (
      <SocketContext.Provider value={{ sendMessage }}>{children}</SocketContext.Provider>
   );
}

export default SocketProvider;
