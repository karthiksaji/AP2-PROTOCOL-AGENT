# AP2 Frontend Demo

A modern React frontend demonstrating the **Agent Payments Protocol (AP2)** commerce flow. This educational UI visualizes how multiple AI agents collaborate to fulfill a user's purchase intent.

## Features

- **Agent Orchestration Visualization**: See the Shopping, Merchant, Credentials, and Payment agents work in real-time.
- **Live Agent Logs**: A streaming console showing the internal communication between agents.
- **Modern UI**: Dark-mode, card-based design built with Tailwind CSS.
- **Mock Mode**: Runs standalone without a backend for easy demonstration.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:5173`

## Demo Flow

1.  **Intent**: Enter a prompt like "I want to buy a coffee machine".
2.  **Discovery**: The Shopping Agent contacts the Merchant Agent to find a product.
3.  **Selection**: Review the found product and proceed.
4.  **Payment**: Select a payment method (Credentials Provider).
5.  **Completion**: The Payment Processor verifies the mandate and issues a receipt.

## Project Structure

```
src/
├── api/            # Mock API client
├── components/     # UI Components (Timeline, Logs, Cards)
├── hooks/          # Custom hooks (useAgentLogs)
├── styles/         # Tailwind setup
├── App.tsx         # Main orchestration logic
└── main.tsx        # Entry point
```
