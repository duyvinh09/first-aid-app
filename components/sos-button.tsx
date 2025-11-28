"use client";

import { PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";

export function SOSButton() {
  const [phoneNumber, setPhoneNumber] = useState("115");

  useEffect(() => {
    // Lấy số đã lưu (nếu có)
    const saved = localStorage.getItem("emergency_contact");
    if (saved) setPhoneNumber(saved);
  }, []);

  const handleSOS = () => {
    if (confirm(`Gọi khẩn cấp ${phoneNumber}?`)) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className="fixed bottom-24 left-6 z-50">
      <div className="absolute -inset-1 animate-ping rounded-full bg-red-500 opacity-75"></div>
      <button
        onClick={handleSOS}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-red-600 text-white shadow-xl transition hover:scale-110 hover:bg-red-700"
      >
        <PhoneCall size={24} className="animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-yellow-400 text-[10px] font-bold text-black">
          SOS
        </span>
      </button>
    </div>
  );
}