"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EmailGraph from "@/components/email-graph";
import EmailConfigModal from "@/components/email-config-modal";
import SummaryModal from "@/components/summary-modal";
import MailboxList from "@/components/mailbox-list";
import Toaster, { toast } from "@/components/toaster";

export default function DemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [lastConfig, setLastConfig] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    emailCount: 0,
    nodeCount: 0,
    connectionCount: 0,
  });
  const [mailboxUpdateKey, setMailboxUpdateKey] = useState(0);

  // Load graph data from Local API on mount
  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();

      if (data.success) {
        setGraphData(data.graphData || []);
        setStats(data.stats || {
          emailCount: 0,
          nodeCount: 0,
          connectionCount: 0,
        });
      }
    } catch (error) {
      console.error("Error loading graph data:", error);
    }
  };

  const handleEmailsFetched = (fetchedEmails: any[], fetchedGraphData?: any[], config?: any) => {
    setEmails(fetchedEmails);
    if (fetchedGraphData) {
      setGraphData(fetchedGraphData);
    }
    if (config) {
      setLastConfig(config);
    }
    // Reload graph data from database
    loadGraphData();
    // Trigger mailbox list refresh
    setMailboxUpdateKey(prev => prev + 1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/emails/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log(data)
      if (data.success) {
        // Update graph data
        if (data.graphData) {
          setGraphData(data.graphData);
        }

        // Reload full data from database
        await loadGraphData();
        // Trigger mailbox list refresh
        setMailboxUpdateKey(prev => prev + 1);

        // Log results to console
        console.log("✅ Sync completed:", data.message);
        data.results?.forEach((r: any) => {
          console.log(
            `  ${r.email}: ${r.success ? `${r.count} emails` : `Error: ${r.error}`}`,
          );
        });
      } else {
        console.error("❌ Sync failed:", data.error);
        toast.error(data.error || "Failed to sync emails");
      }
    } catch (err: any) {
      console.error("Network error:", err);
      toast.error("Network error while syncing");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSummaryClick = (nodeId: string, conversationId: string, label: string) => {
    setSelectedConversation({ id: conversationId, label });
    setIsSummaryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Email <span className="gradient-text">Intelligence Graph</span>
              </h1>
              <p className="text-lg text-gray-300">
                Interactive visualization of your sales email communications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="glass px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <svg
                  className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Email
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">
                {stats.emailCount}
              </div>
              <div className="text-sm text-gray-400">Emails Synced</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">
                {stats.nodeCount}
              </div>
              <div className="text-sm text-gray-400">Graph Nodes</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">
                {stats.connectionCount}
              </div>
              <div className="text-sm text-gray-400">Connections</div>
            </div>
          </div>

          <EmailGraph
            emails={emails}
            graphData={graphData}
          />

          {/* Mailbox List */}
          <MailboxList refreshTrigger={mailboxUpdateKey} />

          {/* Instructions */}
          <div className="mt-8 glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              🚀 How to Use Egraph
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">1.</span>
                <span>
                  <strong>Add Sales Email</strong> — Click{" "}
                  <strong>"Add Email"</strong> and input the sales email
                  credentials (IMAP host, port, password, TLS). This connects
                  the inbox to Egraph.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-blue-400">2.</span>
                <span>
                  <strong>Graph Auto-Generated</strong> — Once synced, incoming
                  emails are automatically grouped by conversation and
                  transformed into a visual relationship graph between Sales and
                  Clients.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-cyan-400">3.</span>
                <span>
                  <strong>Refresh Inbox</strong> — Click{" "}
                  <strong>"Refresh"</strong> anytime to fetch the latest emails
                  and update the graph with new conversations.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-pink-400">4.</span>
                <span>
                  <strong>Edit Email Configuration</strong> — You can update or
                  modify sales email settings if credentials or server details
                  change.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-yellow-400">5.</span>
                <span>
                  <strong>View All Messages</strong> — Browse the complete list
                  of synced messages from each sales account to inspect
                  communication history.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-green-400">6.</span>
                <span>
                  <strong>AI Summary</strong> — Hover over a conversation thread
                  node and click <strong>"✨ Summary"</strong> to generate an
                  AI-powered overview of the discussion context.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />

      {/* Email Config Modal */}
      <EmailConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmailsFetched={handleEmailsFetched}
      />

      {/* Summary Modal */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        conversationId={selectedConversation?.id || null}
        conversationLabel={selectedConversation?.label}
      />

      <Toaster />
    </div>
  );
}