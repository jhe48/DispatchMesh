"use client";

import { useEffect, useState, useRef } from "react";

interface UserPanelProps {
    role: string;
    token: string;
}

export default function UserPanel({ role, token }: UserPanelProps) {
  const [status, setStatus] = useState("Disconnected");
  const ws = useRef(new WebSocket("ws://localhost:3000"));

  useEffect(() => {

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        type: "auth",
        payload: token
      }));
      setStatus("Connected");
      console.log("Server Connected");
    };

    ws.current.onmessage = (event) => {
      console.log("JWT Validity: ", event.data);
    }  
    return () => {
      ws.current.close()
    };
  }, []);
  return (
    <div className="p-8">
      <p>Status: {status}</p>
    </div>
  );
}