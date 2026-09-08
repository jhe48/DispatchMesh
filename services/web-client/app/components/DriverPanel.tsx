import React from "react"

interface DriverDashboardProps {
    ws: React.RefObject<WebSocket>;
}

export default function DriverDashboard({ ws }: DriverDashboardProps) {
    return (
        <p> DRIVER </p>
    );
}