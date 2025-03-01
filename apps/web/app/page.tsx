"use client";

import React, { useState } from "react";
import { useSocket } from "../context/SocketProvider";

export default function page() {
   const { sendMessage } = useSocket();
   const [message, setMessage] = useState<string>("");

   return (
      <div className="flex">
         <div>
            <input
               placeholder="hello"
               className="border"
               onChange={(e) => setMessage(e.target.value)}
            />
            <button
               className="border"
               onClick={() => {
                  sendMessage(message);
               }}
            >
               hello
            </button>
         </div>
      </div>
   );
}
