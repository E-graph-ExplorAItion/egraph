"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MailboxActionModal from "./mailbox-action-modal";

export default function MailboxList({ refreshTrigger = 0 }: { refreshTrigger?: number }) {
  const router = useRouter();
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMailbox, setSelectedMailbox] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMailboxes();
  }, [refreshTrigger]);

  const fetchMailboxes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/mailboxes");
      const data = await response.json();
      if (data.success) {
        setMailboxes(data.mailboxes);
      }
    } catch (error) {
      console.error("Error fetching mailboxes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (mailbox: any) => {
    setSelectedMailbox(mailbox);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchMailboxes();
  };

  if (loading && mailboxes.length === 0) {
    return (
      <div className="glass p-8 rounded-2xl border border-white/10 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">
        Managed <span className="gradient-text">Emails</span>
      </h3>
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">IMAP Host</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mailboxes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No mailboxes configured. Add one to get started.
                  </td>
                </tr>
              ) : (
                mailboxes.map((mailbox) => (
                  <tr key={mailbox.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {mailbox.email_address[0]?.toUpperCase()}
                        </div>
                        <span className="text-gray-200">{mailbox.email_address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {mailbox.imap_host}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(mailbox)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MailboxActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mailbox={selectedMailbox}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
