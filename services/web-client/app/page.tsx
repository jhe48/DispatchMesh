"use client";
import { useState } from "react";
import UserPanel from "./components/UserPanel";

export default function DispatchDashboard() {

  // Track active tab
  const [activeRiderIndex, setActiveRiderIndex] = useState(0);
  const [activeDriverIndex, setActiveDriverIndex] = useState(0);
  const [notifiedRiders, setNotifiedRiders] = useState<number[]>([]);
  const [notifiedDrivers, setNotifiedDrivers] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 50));
  };
  const riders = [
    { id: "testrider123", label: "testrider123", token: process.env.NEXT_PUBLIC_TEST_RIDER_1_TOKEN },
    { id: "batman", label: "batman", token: process.env.NEXT_PUBLIC_TEST_RIDER_2_TOKEN },
    { id: "Joker", label: "Joker", token: process.env.NEXT_PUBLIC_TEST_RIDER_3_TOKEN },
    { id: "VICTOR DOOM", label: "VICTOR DOOM", token: process.env.NEXT_PUBLIC_TEST_RIDER_4_TOKEN },
    { id: "ReEd RiCh", label: "ReEd RiCh", token: process.env.NEXT_PUBLIC_TEST_RIDER_5_TOKEN }
  ];
  const drivers = [
    { id: "-1", label: "Driver 1", token: process.env.NEXT_PUBLIC_TEST_DRIVER_1_TOKEN },
    { id: "-2", label: "Driver 2", token: process.env.NEXT_PUBLIC_TEST_DRIVER_2_TOKEN },
    { id: "-3", label: "Driver 3", token: process.env.NEXT_PUBLIC_TEST_DRIVER_3_TOKEN },
    { id: "-4", label: "Driver 4", token: process.env.NEXT_PUBLIC_TEST_DRIVER_4_TOKEN },
    { id: "-5", label: "Driver 5", token: process.env.NEXT_PUBLIC_TEST_DRIVER_5_TOKEN }
  ]
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020604] px-4 py-5 font-sans font-medium tracking-[0.01em] text-slate-300 sm:px-6 lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,236,154,0.14),transparent_34%),linear-gradient(115deg,rgba(0,255,170,0.03),transparent_42%)]" />
      <div className="relative z-10 mx-auto max-w-[1800px]">
        <header className="mb-6 flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.025em] text-white sm:text-3xl">Dispatch <span className="text-emerald-200/80">Dashboard</span></h1>
          </div>
        </header>
        {/* Terminal */}
        <div className="mb-5 flex flex-col rounded-lg border border-white/10 bg-[#0a0a0a] shadow-xl">
          {/* Terminal Header (Mac Window Style) */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-red-500/80"></span>
            <span className="h-2 w-2 rounded-full bg-amber-500/80"></span>
            <span className="h-2 w-2 rounded-full bg-emerald-500/80"></span>
            <span className="ml-2 font-mono text-[9px] font-bold tracking-widest text-slate-500
  uppercase">server_logs ~ bash</span>
          </div>

          {/* Terminal Output */}
          <div className="h-32 overflow-y-auto p-4 font-mono text-[10px] text-emerald-400 leading-relaxed">
            {logs.length === 0 ? <span className="opacity-50">awaiting websocket connections...</span> : null}

            {/* Only render the 8 most recent logs */}
            {logs.slice(0, 8).map((log, i) => (
              <div key={i} className="mb-1 truncate opacity-90">
                <span className="text-slate-500">{`>`} </span>
                {log}
              </div>
            ))}
          </div>
        </div>
        <div className="grid min-h-[calc(100vh-150px)] gap-5 lg:grid-cols-2">
          {/* RIDER COLUMN */}
          <section className="min-w-0 rounded-2xl border border-emerald-300/15 bg-white/[0.035] p-3 shadow-2xl shadow-emerald-950/20 backdrop-blur sm:p-5">
            <div className="mb-4 flex w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-1">
              {riders.map((rider, index) => (
                <button
                  key={rider.id}
                  onClick={() => {
                    setActiveRiderIndex(index);
                    setNotifiedRiders(prev => prev.filter(i => i !== index));
                    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
                  }}
                  className={`min-w-[78px] flex-1 rounded-lg px-2 py-2 text-[11px] font-bold tracking-wide transition-colors duration-200 sm:px-3 ${activeRiderIndex === index ? 'bg-emerald-300 text-[#03120c] shadow-[0_0_18px_rgba(110,231,183,0.2)]'
                    : notifiedRiders.includes(index) ? 'animate-pulse bg-emerald-600/80 text-white'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >{rider.label}</button>
              ))}
            </div>
            {riders.map((rider, index) => (
              <div key={rider.id} className={activeRiderIndex === index ? 'block' : 'hidden'}><UserPanel token={rider.token!} role="rider" onNotification={() => setNotifiedRiders(prev => [...prev, index])} onLog={addLog} /></div>
            ))}
          </section>
          {/* DRIVER COLUMN */}
          <section className="min-w-0 rounded-2xl border border-amber-200/10 bg-white/[0.035] p-3 shadow-2xl shadow-amber-950/10 backdrop-blur sm:p-5">
            <div className="mb-4 flex w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-1">
              {drivers.map((driver, index) => (
                <button
                  key={driver.id}
                  onClick={() => {
                    setActiveDriverIndex(index);
                    setNotifiedDrivers(prev => prev.filter(i => i !== index));
                    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
                  }}
                  className={`min-w-[78px] flex-1 rounded-lg px-2 py-2 text-[11px] font-bold tracking-wide transition-colors duration-200 sm:px-3 ${activeDriverIndex === index ? 'bg-amber-200 text-[#171006] shadow-[0_0_18px_rgba(253,230,138,0.16)]'
                    : notifiedDrivers.includes(index) ? 'animate-pulse bg-amber-500/80 text-white'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >{driver.label}</button>
              ))}
            </div>
            {drivers.map((driver, index) => (
              <div key={driver.id} className={activeDriverIndex === index ? 'block' : 'hidden'}><UserPanel token={driver.token!} role="driver" onNotification={() => setNotifiedDrivers(prev => [...prev, index])} onLog={addLog} /></div>
            ))}
          </section>
        </div>

      </div>
    </main>
  )
}
