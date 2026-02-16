import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="animate-fade-in-up">
              <div className="inline-block mb-4 px-4 py-2 rounded-full glass border border-purple-500/30">
                <span className="text-sm text-purple-300">✨ Email Intelligence Graph</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                See Every Sales
                <br />
                <span className="gradient-text">Conversation</span>
                <br />
                Without Asking
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                Transform your team's email communications into intelligent graph visualizations. 
                Get instant AI-powered summaries of every client conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/demo" className="glass px-8 py-4 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all">
                  Watch Demo
                </a>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Email Visibility</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div>
                  <div className="text-3xl font-bold text-white">&lt;30s</div>
                  <div className="text-sm text-gray-400">Context Understanding</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div>
                  <div className="text-3xl font-bold text-white">AI</div>
                  <div className="text-sm text-gray-400">Powered Summaries</div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-3xl blur-2xl"></div>
              <Image
                src="/hero-graph-removebg-preview.png"
                alt="Email Graph Visualization"
                width={600}
                height={600}
                className="relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features for <span className="gradient-text">Sales Leaders</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to monitor and understand your team's client communications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto Email Sync</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatically connect and sync your team's email inboxes via IMAP. No manual work required.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Graph Visualization</h3>
              <p className="text-gray-400 leading-relaxed">
                See conversations as interactive graphs with nodes for sales, clients, and email threads.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Summaries</h3>
              <p className="text-gray-400 leading-relaxed">
                Get instant context with AI-powered summaries of entire conversation threads.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Thread Grouping</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatically group related emails into conversation threads for better context.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure & Private</h3>
              <p className="text-gray-400 leading-relaxed">
                All credentials encrypted. Your email data stays secure with enterprise-grade protection.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Updates</h3>
              <p className="text-gray-400 leading-relaxed">
                Stay updated with scheduled syncs every 5 minutes. Never miss important conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Benefits List */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Built for <span className="gradient-text">Head of Sales</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Stop asking your team for updates. Get complete visibility into every client conversation.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Know Which Clients Are Active</h3>
                    <p className="text-gray-400">See at a glance which deals are hot and which need attention.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Understand Deal Status Instantly</h3>
                    <p className="text-gray-400">AI summaries give you the full context in seconds, not hours.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">No More Awkward Check-ins</h3>
                    <p className="text-gray-400">Monitor without micromanaging. Your team stays autonomous.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Catch Deals Before They Slip</h3>
                    <p className="text-gray-400">Identify risks early with comprehensive conversation tracking.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="glass p-8 rounded-3xl">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-2xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">S</div>
                    <div>
                      <div className="text-white font-semibold">Sarah (Sales)</div>
                      <div className="text-sm text-gray-400">→ Acme Corp</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">
                    "Proposal sent. Client requested pricing revision..."
                  </div>
                  <button className="text-xs px-4 py-2 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors">
                    View Summary
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">M</div>
                    <div>
                      <div className="text-white font-semibold">Mike (Sales)</div>
                      <div className="text-sm text-gray-400">→ TechStart Inc</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">
                    "Demo scheduled for next week. High interest..."
                  </div>
                  <button className="text-xs px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
                    View Summary
                  </button>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 p-6 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">J</div>
                    <div>
                      <div className="text-white font-semibold">Jessica (Sales)</div>
                      <div className="text-sm text-gray-400">→ Global Solutions</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3">
                    "Contract negotiation in progress. Legal review..."
                  </div>
                  <button className="text-xs px-4 py-2 rounded-full bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors">
                    View Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How <span className="gradient-text">Egraph</span> Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple setup, powerful insights in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Connect Emails</h3>
              <p className="text-gray-400">
                Add your team's email credentials securely via IMAP
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto Sync</h3>
              <p className="text-gray-400">
                System automatically fetches and organizes emails
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">View Graphs</h3>
              <p className="text-gray-400">
                See conversations as interactive graph visualizations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Get Insights</h3>
              <p className="text-gray-400">
                Click "Summary" for AI-powered context and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
