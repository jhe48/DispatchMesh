import React from "react"

interface RiderDashboardProps {
    ws: React.RefObject<WebSocket>;
}

export default function RiderDashboard({ ws }: RiderDashboardProps) {
    return (
        <p>RIDER</p>
    );
} 