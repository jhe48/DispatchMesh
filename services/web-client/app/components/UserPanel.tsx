"use client";

import { stat } from "fs";
import { useEffect, useState, useRef } from "react";

interface UserPanelProps {
    role: string;
    token: string;
}

export default function UserPanel({ role, token }: UserPanelProps) {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const ws = useRef(new WebSocket("ws://localhost:3000"));

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "auth",
        payload: token
      }));
      setStatus("Connected");
      console.log("Server Connected");
    };

    ws.onmessage = (event) => {
      console.log("JWT Validity: ", event.data);
    }  
    return () => {
      ws.close()
    };
  }, []);
  return (
    <div className="p-8">
      <p>Status: {status}</p>
    </div>
  );
}