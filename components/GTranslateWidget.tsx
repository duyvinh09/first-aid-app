
"use client";
import { useEffect } from "react";

export default function GTranslateWidget() {
  useEffect(() => {
    // Thêm script settings
    const settingsScript = document.createElement('script');
    settingsScript.innerHTML = `window.gtranslateSettings = {"default_language":"en","wrapper_selector":".gtranslate_wrapper","flag_size":16,"horizontal_position":"right","vertical_position":"bottom"}`;
    document.head.appendChild(settingsScript);
    // Thêm script widget
    const widgetScript = document.createElement('script');
    widgetScript.src = "https://cdn.gtranslate.net/widgets/latest/popup.js";
    widgetScript.defer = true;
    document.head.appendChild(widgetScript);
    // Cleanup khi unmount
    return () => {
      settingsScript.remove();
      widgetScript.remove();
    };
  }, []);
  return <div className="gtranslate_wrapper"></div>;
}

