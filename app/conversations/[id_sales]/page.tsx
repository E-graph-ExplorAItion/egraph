"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SummaryModal from "@/components/summary-modal";
import { toast } from "@/components/toaster";

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  body: string;
  sent_at: string;
  direction: 'inbound' | 'outbound';
}

interface Client {
  id: string;
  name: string;
  metadata?: any;
  conversationId?: string;
  messages?: Message[];
}

interface SalesData {
  id: string;
  name: string;
  clients: Client[];
}

export default function SalesConversationsPage() {
  const params = useParams();
  const router = useRouter();
  const id_sales = params.id_sales as string;

  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    if (id_sales) {
      fetchSalesData();
    }
  }, [id_sales]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sales/${id_sales}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }

      const data = await response.json();
      setSalesData(data);

      if (data.clients && data.clients.length > 0) {
        setSelectedClient(data.clients[0]);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      toast.error("Failed to load sales conversations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-white mb-2">
                Conversations for <span className="gradient-text">{salesData?.name}</span>
              </h1>
              <p className="text-gray-400 text-lg">Browse communication history and AI insights</p>
            </div>
          </div>

          {!salesData?.clients || salesData.clients.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center border border-white/10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Clients Found</h3>
              <p className="text-gray-400">Sync your inbox to discover client relationships.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Client List */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xl font-bold text-white px-2">Contacts</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {salesData.clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                        selectedClient?.id === client.id
                          ? "bg-white/10 border-white/20 text-white shadow-xl shadow-purple-500/10"
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        selectedClient?.id === client.id ? "bg-purple-500 text-white" : "bg-white/10 text-gray-400"
                      }`}>
                        {client.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium truncate">{client.name}</span>
                      {selectedClient?.id === client.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Detail / Message List */}
              <div className="lg:col-span-8">
                {selectedClient && (
                  <div className="glass rounded-3xl border border-white/10 p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-purple-500/20">
                          {selectedClient.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white">{selectedClient.name}</h2>
                          <p className="text-gray-400">Communication History</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsSummaryModalOpen(true)}
                        className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
                      >
                        <span className="text-lg">✨</span>
                        AI Summary
                      </button>
                    </div>

                    <div className="flex-grow space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedClient.messages && selectedClient.messages.length > 0 ? (
                        selectedClient.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${
                              msg.direction === 'outbound' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1 px-1">
                              <span className="text-xs text-gray-500">
                                {new Date(msg.sent_at).toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-gray-400">
                                {msg.direction === 'outbound' ? 'To: ' : 'From: '}
                                {msg.direction === 'outbound' ? msg.recipient_name || msg.recipient_email : msg.sender_name || msg.sender_email}
                              </span>
                            </div>
                            <div
                              className={`max-w-[85%] p-4 rounded-2xl border ${
                                msg.direction === 'outbound'
                                  ? 'bg-purple-500/10 border-purple-500/20 text-gray-200'
                                  : 'bg-white/5 border-white/10 text-gray-300'
                              }`}
                            >
                              <div className="font-semibold text-sm mb-2 text-white/90 border-b border-white/5 pb-2">
                                {msg.subject}
                              </div>
                              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {msg.body}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                          No messages found for this contact.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Summary Modal */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        conversationId={selectedClient?.conversationId || null}
        conversationLabel={`Summary for ${selectedClient?.name}`}
      />
    </div>
  );
}
