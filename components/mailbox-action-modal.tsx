"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./toaster";

interface MailboxActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mailbox: any | null;
  onSuccess: () => void;
}

export default function MailboxActionModal({
  isOpen,
  onClose,
  mailbox,
  onSuccess,
}: MailboxActionModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email_address: "",
    imap_host: "",
    imap_port: "",
    imap_password: "",
    use_tls: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (mailbox) {
      setFormData({
        email_address: mailbox.email_address || "",
        imap_host: mailbox.imap_host || "",
        imap_port: mailbox.imap_port?.toString() || "",
        imap_password: "", // Don't show password for security
        use_tls: mailbox.use_tls === 1,
      });
    }
  }, [mailbox]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/mailboxes/${mailbox.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Mailbox updated successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to update mailbox");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${mailbox?.email_address}?`)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/mailboxes/${mailbox.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Mailbox deleted successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to delete mailbox");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mailbox) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Manage <span className="gradient-text">Mailbox</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Update settings or remove this mailbox
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email_address}
              onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Password (leave blank to keep current)</label>
            <input
              type="password"
              value={formData.imap_password}
              onChange={(e) => setFormData({ ...formData, imap_password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">IMAP Host</label>
            <input
              type="text"
              required
              value={formData.imap_host}
              onChange={(e) => setFormData({ ...formData, imap_host: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Port</label>
              <input
                type="number"
                required
                value={formData.imap_port}
                onChange={(e) => setFormData({ ...formData, imap_port: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Use TLS</label>
              <div className="flex items-center h-[52px]">
                <input
                  type="checkbox"
                  checked={formData.use_tls}
                  onChange={(e) => setFormData({ ...formData, use_tls: e.target.checked })}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-400">Enabled</span>
              </div>
            </div>
          </div>


          <div className="flex flex-col gap-3 pt-4">
             <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              Update Config
            </button>

            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
