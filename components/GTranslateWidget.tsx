"use client";
import { useEffect } from "react";

export default function GTranslateWidget() {
  useEffect(() => {
    (window as any).gtranslateSettings = {
      default_language: "en",
      wrapper_selector: ".gtranslate_wrapper",
      flag_size: 16,
      horizontal_position: "right",
      vertical_position: "bottom",
    };

    const existing = document.getElementById("gtranslate-widget-script");
    if (!existing) {
      const widgetScript = document.createElement("script");
      widgetScript.id = "gtranslate-widget-script";
      widgetScript.src = "https://cdn.gtranslate.net/widgets/latest/popup.js";
      widgetScript.defer = true;
      document.head.appendChild(widgetScript);
    }
    // Không xóa script để tránh nạp lại không cần thiết khi điều hướng
    return () => {};
  }, []);
  return <div className="gtranslate_wrapper"></div>;
}
