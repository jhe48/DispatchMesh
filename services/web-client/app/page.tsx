"use client";

import { useEffect, useState } from "react";

export default function DispatchDashboard() {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    // Initialize the WS connection to gateway localhost:3000
    const ws = new WebSocket("ws://localhost:3000");

    // listen for open event 
    ws.onmessage = (event) => {
      console.log("Message from the server: ", event.data);
    };
  
    // update state to Connected and send fake JWT Auth message
    // listen for message event
    // when a message comes in, just console log it
    // close WS when component unmounts
    return () => {
      //close WS
    };
  }, []);

  return (
    <div className="p-8">
      <h1>Dispatch Mesh Dashboard</h1>
      <p>Status: {status}</p>
    </div>
  );
}