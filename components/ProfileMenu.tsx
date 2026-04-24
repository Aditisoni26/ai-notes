"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const name = session?.user?.name || "User";
  const email = session?.user?.email || "No email";

  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      
      {/* 🔵 AVATAR BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition"
      >
        {firstLetter}
      </button>

      {/* 🔽 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-50">
          
          <p className="text-sm font-semibold">
            {name}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {email}
          </p>

          <button
            onClick={() => signOut()}
            className="w-full text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 px-2 py-1 rounded"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}