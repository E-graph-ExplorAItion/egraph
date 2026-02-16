# Egraph - Email Intelligence Graph

**Egraph** is an intelligent email visualization tool designed for high-performing sales leaders. It transforms your team's flat email lists into interactive graph visualizations, giving you instant visibility into client relationships, deal momentum, and team activity without the need for manual reporting or micromanagement.

![Egraph Hero](/public/hero-graph-removebg-preview.png)

## � Screenshots

| Dashboard View | Conversation View |
|:---:|:---:|
| ![Dashboard](/public/demograph.png) | ![Conversation](/public/demosummary.png) |

## �🚀 Key Features

*   **Interactive Graph Visualization**: See your sales ecosystem at a glance. Visual nodes represent Sales Reps, Clients, and Communication Threads, automatically linked based on actual email interactions.
*   **Auto-Sync Engine**: Connects securely via IMAP to any email provider. Automatically fetches, parses, and organizes emails into conversation threads every 5 minutes.
*   **AI-Powered Sales Insights**:
    *   **Concise Analysis**: Uses state-of-the-art AI (via OpenRouter/Nemotron) to generate punchy, 2-3 sentence summaries focused on sales momentum, core intent, and next steps.
    *   **"Concise Business Analyst" Persona**: tuned to cut through the noise and deliver high-impact intelligence.
*   **One-Click Navigation**: Jump directly from a Sales node in the graph to the full conversation history for that specific mailbox.
*   **Thread Grouping**: Automatically groups related emails into coherent conversation threads, preserving context even across long exchanges.
*   **Secure & Private**: All email credentials and data are stored locally using SQLite. No external data leakage.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **UI Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Visualization**: [React Flow](https://reactflow.dev/)
*   **Database**: [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
*   **Email Engine**: `node-imap`, `mailparser`
*   **AI Integration**: OpenRouter API (Accessing models like `nvidia/nemotron-3-nano-30b-a3b`)

## 🏁 Getting Started

Follow these steps to get Egraph running locally on your machine.

### Prerequisites

*   Node.js 18+ installed
*   An OpenRouter API key for AI features

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/E-graph-ExplorAItion/egraph.git
    cd egraph
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your OpenRouter API key:
    ```bash
    OPENROUTER_API_KEY="your_openrouter_api_key_here"
    ENCRYPTION_KEY="default_secret_key_change_me_plz"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

1.  **Enter Demo Mode**: Click the **"Demo"** button on the landing page or navigate to `/demo`.
2.  **Connect a Mailbox**:
    *   Click **"Add Email"**.
    *   Enter the IMAP credentials (Email, Password, Host, Port) for a sales account.
    *   *Note: For Gmail, use an App Password.*
3.  **Sync Emails**: Even though auto-sync runs periodically, you can click **"Refresh"** to trigger an immediate fetch of the latest emails.
4.  **Explore the Graph**:
    *   **Sales Nodes** (Purple): Represent your sales team members. Click to view their full inbox and conversation list.
    *   **Client Nodes** (Blue): Represent external clients.
    *   **Edges**: Show active communication channels.

## 📄 License

This project is licensed under the MIT License.
