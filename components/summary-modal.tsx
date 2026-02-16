"use client";

import { useState, useEffect } from "react";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string | null;
  conversationLabel?: string;
}

export default function SummaryModal({
  isOpen,
  onClose,
  conversationId,
  conversationLabel,
}: SummaryModalProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch summary when modal opens
  useEffect(() => {
    if (isOpen && conversationId) {
      fetchSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, conversationId]);

  const fetchSummary = async () => {
    if (!conversationId) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Failed to generate summary");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
      <div className="relative glass rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl max-h-[80vh] overflow-y-auto">
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
            AI <span className="gradient-text">Summary</span>
          </h2>
          {conversationLabel && (
            <p className="text-gray-400 text-sm">
              {conversationLabel}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-12 w-12 text-purple-500 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-300">Generating AI summary...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300">
              {error}
            </div>
          )}

          {summary && !loading && (
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          )}

          {!loading && !error && !summary && (
            <div className="text-center py-8 text-gray-400">
              No summary available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
