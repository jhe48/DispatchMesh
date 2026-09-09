"use client";

import { useEffect, useState, useRef } from "react";
import RiderDashboard from "./RiderPanel";
import DriverDashboard from "./DriverPanel";

interface UserPanelProps {
    role: string;
    token: string;
}

export default function UserPanel({ role, token }: UserPanelProps) {
  const [status, setStatus] = useState("Disconnected");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");
    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
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
      ws.current?.close()
    };
  }, []);
  return ( role==="rider" ?
    <>
      <RiderDashboard ws={ws} status={status}/>
    </> :
    <>
      <DriverDashboard ws={ws} status={status}/>
    </>
  );
}