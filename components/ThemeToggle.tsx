"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${dark 
          ? "bg-yellow-400/20 text-yellow-500 hover:bg-yellow-400/30" 
          : "bg-gray-800/10 text-gray-800 hover:bg-gray-800/20"
        }`}
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}