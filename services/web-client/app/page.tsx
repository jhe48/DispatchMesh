"use client";

import { useEffect, useState } from "react";

export default function DispatchDashboard() {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    // Initialize the WS connection to gateway localhost:3000
    const ws = new WebSocket("ws://localhost:3000");

    // listen for open event 
    ws.onopen = (event) => {
      ws.send(JSON.stringify({
        type: "auth",
        payload: process.env.JWT_HARDCODE
      }));
      setStatus("Connected");
      console.log("Connected");
    };
  
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