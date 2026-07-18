"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      dir="rtl"
      toastOptions={{
        style: {
          background: "#0d0d1a",
          border: "1px solid rgba(200, 150, 46, 0.2)",
          color: "#e8e8e8",
          fontFamily: "Cairo, sans-serif",
          fontSize: "14px",
          borderRadius: "12px",
        },
        success: { iconTheme: { primary: "#c8962e", secondary: "#0d0d1a" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#0d0d1a" } },
      }}
    />
  );
}