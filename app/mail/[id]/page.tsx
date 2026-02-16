"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function MailboxMessagesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mailboxes/${id}/messages`);
      const data = await response.json();
      console.log(data)
      if (data.success) {
        setMessages(data.messages || []);
        setEmail(data.email);
      } else {
        setError(data.error || "Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/demo")}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Messages for <span className="gradient-text">{email || "Mailbox"}</span>
              </h1>
              <p className="text-lg text-gray-300">
                Detailed list of all synced emails for this account
              </p>
            </div>
          </div>

          {/* Messages Table */}
          <div className="glass rounded-2xl border border-white/10 overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Error Loading Messages</h3>
                <p className="text-gray-400 max-w-md">{error}</p>
                <button
                  onClick={fetchMessages}
                  className="mt-6 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all underline underline-offset-4"
                >
                  Try Again
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Messages Found</h3>
                <p className="text-gray-400">We haven't synced any messages for this account yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold w-1/4">ID</th>
                      <th className="px-6 py-4 font-semibold">Body</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                          {msg.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300 text-sm line-clamp-2 max-w-2xl">
                            {msg.body}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
