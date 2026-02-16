"use client";

import { useState } from "react";
import { toast } from "./toaster";

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailsFetched?: (emails: any[], graphData?: any[], config?: any) => void;
}

export default function EmailConfigModal({ isOpen, onClose, onEmailsFetched }: EmailConfigModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/emails/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully adding emails!`);
        if (onEmailsFetched) {
          onEmailsFetched(data.emails || [], data.graphData || [], formData);
        }
        onClose();
      } else {
        toast.error(data.error || "Failed to fetch emails");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Configure <span className="gradient-text">Email</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your IMAP credentials to fetch emails
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="sales@company.com"
            />
          </div>

          {/* App Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              App Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              For Gmail, generate an app password from your Google Account settings
            </p>
          </div>

          {/* IMAP Host */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              IMAP Host
            </label>
            <input
              type="text"
              required
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="imap.gmail.com"
            />
          </div>

          {/* Port & TLS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Port
              </label>
              <input
                type="number"
                required
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Use TLS
              </label>
              <div className="flex items-center h-[52px]">
                <input
                  type="checkbox"
                  checked={formData.tls}
                  onChange={(e) => setFormData({ ...formData, tls: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-400">Enabled</span>
              </div>
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Fetching Emails...
              </span>
            ) : (
              "Fetch Emails"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
