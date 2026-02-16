"use client";

import { useState, useEffect } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastCount = 0;
let observers: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  info: (message: string) => addToast(message, "info"),
};

const addToast = (message: string, type: Toast["type"]) => {
  const id = `toast-${toastCount++}`;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => removeToast(id), 5000);
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
};

const notify = () => {
  observers.forEach((cb) => cb(toasts));
};

export default function Toaster() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const observer = (newToasts: Toast[]) => setActiveToasts(newToasts);
    observers.push(observer);
    return () => {
      observers = observers.filter((cb) => cb !== observer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
      {activeToasts.map((t) => (
        <div
          key={t.id}
          className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-10 flex items-center gap-3 min-w-[300px] ${
            t.type === "success"
              ? "bg-green-500/20 border-green-500/30 text-green-300"
              : t.type === "error"
              ? "bg-red-500/20 border-red-500/30 text-red-300"
              : "bg-blue-500/20 border-blue-500/30 text-blue-300"
          }`}
        >
          {t.type === "error" && (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {t.type === "success" && (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
