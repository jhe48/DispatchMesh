"use client";
import { useState } from "react";
import UserPanel from "./components/UserPanel";

export default function DispatchDashboard() {

  // Track active tab
  const [activeRiderIndex, setActiveRiderIndex] = useState(0);
  const [activeDriverIndex, setActiveDriverIndex] = useState(0);
  const [notifiedRiders, setNotifiedRiders] = useState<number[]>([]);
  const [notifiedDrivers, setNotifiedDrivers] = useState<number[]>([]);

  const riders = [
    { id: "testrider123", label: "Rider 1", token: process.env.NEXT_PUBLIC_TEST_RIDER_1_TOKEN },
    { id: "batman", label: "Rider 2", token: process.env.NEXT_PUBLIC_TEST_RIDER_2_TOKEN },
    { id: "Joker", label: "Rider 3", token: process.env.NEXT_PUBLIC_TEST_RIDER_3_TOKEN },
    { id: "VICTOR DOOM", label: "Rider 4", token: process.env.NEXT_PUBLIC_TEST_RIDER_4_TOKEN },
    { id: "ReEd RiCh", label: "Rider 5", token: process.env.NEXT_PUBLIC_TEST_RIDER_5_TOKEN }
  ];
  const drivers = [
    { id: "-1", label: "Driver 1", token: process.env.NEXT_PUBLIC_TEST_DRIVER_1_TOKEN },
    { id: "-2", label: "Driver 2", token: process.env.NEXT_PUBLIC_TEST_DRIVER_2_TOKEN },
    { id: "-3", label: "Driver 3", token: process.env.NEXT_PUBLIC_TEST_DRIVER_3_TOKEN },
    { id: "-4", label: "Driver 4", token: process.env.NEXT_PUBLIC_TEST_DRIVER_4_TOKEN },
    { id: "-5", label: "Driver 5", token: process.env.NEXT_PUBLIC_TEST_DRIVER_5_TOKEN }
  ]
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dispatch Dashboard</h1>
      {/* RIDER COLUMN */}
      <div className="flex h-screen space-x-4">
        <div className="w-1/2 p-8">
          <div className="flex w-full">
            {riders.map((rider, index) => (
              <button
                key={rider.id}
                onClick={() => {
                  setActiveRiderIndex(index);
                  setNotifiedRiders(prev => prev.filter(i => i !== index));
                  setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
                }}
                className={`flex-1 px-4 py-2 rounded-t-lg ${
                  activeRiderIndex === index ? 'bg-blue-500 text-white' 
                  : notifiedRiders.includes(index) ? 'bg-green-500 animate-pulse text-white'
                  : 'bg-gray-700'}`}
              >
                {rider.label}
              </button>
            ))}
          </div>

          {riders.map((rider, index) => (
            <div key={rider.id} className={activeRiderIndex === index ? 'block' : 'hidden'}>
              <UserPanel 
                token={rider.token!} 
                role="rider" 
                onNotification={() => setNotifiedRiders(prev => [...prev, index])}
              />
            </div>
          ))}
        </div>

        {/* DRIVER COLUMN */}
        <div className="w-1/2 p-8">
          <div className="flex w-full">
            {drivers.map((driver, index) => (
              <button
                key={driver.id}
                onClick={() => {
                  setActiveDriverIndex(index);
                  setNotifiedDrivers(prev => prev.filter(i => i !== index));
                  setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
                }}
                className={`flex-1 px-4 py-2 rounded-t-lg ${
                  activeDriverIndex === index ? 'bg-blue-500 text-white' 
                  : notifiedDrivers.includes(index) ? 'bg-green-500 animate-pulse text-white'
                  : 'bg-gray-700'}`}
              >
                {driver.label}
              </button>
            ))}
          </div>

          {drivers.map((driver, index) => (
            <div key={driver.id} className={activeDriverIndex === index ? 'block' : 'hidden'}>
              <UserPanel 
                token={driver.token!} 
                role="driver" 
                onNotification={() => setNotifiedDrivers(prev => [...prev, index])}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}