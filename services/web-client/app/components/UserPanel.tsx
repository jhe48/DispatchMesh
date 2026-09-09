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
  const [serverMessage, setServerMessage] = useState(null);


  useEffect(() => {
    const wsURL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";
    ws.current = new WebSocket(wsURL);
    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: "auth",
        payload: token
      }));
      setStatus("Connected");
      console.log("Server Connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "Match_Found":
          setServerMessage(data);
          break;
        case "New_Ride":
          setServerMessage(data);
          break;
        case "cancel_trip":
          setServerMessage(data);
          break;
        default:
          console.log("Other Message:", data)
      }
      console.log("JWT Validity: ", event.data);
    }  
    return () => {
      ws.current?.close()
    };
  }, []);
  return ( role==="rider" ?
    <>
      <RiderDashboard ws={ws} status={status} serverMessage={serverMessage} />
    </> :
    <>
      <DriverDashboard ws={ws} status={status} serverMessage={serverMessage} />
    </>
  );
}