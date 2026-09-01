"use client";

import { useEffect, useState } from "react";

export default function DispatchDashboard() {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    // Initialize the WS connection to gateway localhost:3000
    const ws = new WebSocket("ws://localhost:3000");

    // listen for open event 
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "auth",
        payload: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0cmlkZXIxMjMifQ.K38SAgkNbixawbagxvlyMLlNlLWLSD3U7V3HNGPLnX0"
      }));
      setStatus("Connected");
      console.log("Connected");
    };
  
    return () => {
      ws.close()
    };
  }, []);

  return (
    <div className="p-8">
      <h1>Dispatch Mesh Dashboard</h1>
      <p>Status: {status}</p>
    </div>
  );
}