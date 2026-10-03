import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useState, useEffect } from "react";
import { Signal, Wifi, Battery } from "lucide-react";

function LiveStatusBar() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).replace(" AM", "").replace(" PM", "");
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).replace(" AM", "").replace(" PM", ""));
    };
    // Sync to the next full minute
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000;
    const timeout = setTimeout(() => {
      update();
      const interval = setInterval(update, 60000);
      return () => clearInterval(interval);
    }, msToNextMinute);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-[59px] relative w-full flex items-end pb-[10px] px-6">
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-[10px] -translate-x-1/2 bg-black h-[36px] w-[124px] rounded-[18px]" />

      {/* Time */}
      <span className="text-[17px] font-[600] text-black tracking-[-0.4px] leading-none">
        {time}
      </span>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-[6px]">
        {/* Cellular */}
        <svg width="19" height="13" viewBox="0 0 19 13" fill="none" aria-label="Signal">
          <rect x="0" y="9" width="3" height="4" rx="1" fill="black" />
          <rect x="4" y="6" width="3" height="7" rx="1" fill="black" />
          <rect x="8" y="3.5" width="3" height="9.5" rx="1" fill="black" />
          <rect x="12" y="0" width="3" height="13" rx="1" fill="black" />
          <rect x="16" y="0" width="3" height="13" rx="1" fill="black" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="17" height="13" viewBox="0 0 17 13" fill="black" aria-label="WiFi">
          <path d="M8.5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
          <path d="M3.1 6.9a7.6 7.6 0 0 1 10.8 0l-1.5 1.5a5.6 5.6 0 0 0-7.8 0L3.1 6.9z"/>
          <path d="M0 3.8a12 12 0 0 1 17 0L15.5 5.3a10 10 0 0 0-14 0L0 3.8z"/>
        </svg>
        {/* Battery */}
        <svg width="28" height="13" viewBox="0 0 28 13" fill="none" aria-label="Battery">
          <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" stroke="black" strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="9" rx="2.5" fill="black" />
          <path d="M25.5 4.5v4a2 2 0 0 0 0-4z" fill="black" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      {/* Status bar — always visible on mobile, independent of page */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-[99999]"
        style={{ background: "white" }}
      >
        <LiveStatusBar />
      </div>
      <RouterProvider router={router} />
    </>
  );
}
