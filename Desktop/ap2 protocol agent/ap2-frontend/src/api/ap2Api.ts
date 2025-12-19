export interface Product {
  name: string;
  price: number;
  brand?: string;
  merchant?: string;
}

export interface AgentLog {
  agent: string;
  message: string;
  timestamp?: number;
}

export interface IntentResponse {
  product: Product;
  alternatives?: Product[];
  agentLogs: AgentLog[];
}

export interface PaymentResponse {
  status: string;
  receiptId: string;
  agentLogs: AgentLog[];
}

const API_BASE = 'http://localhost:8000';

const MOCK_PAYMENT_RESPONSE: PaymentResponse = {
  status: "SUCCESS",
  receiptId: "rcpt_" + Math.random().toString(36).substring(7),
  agentLogs: [
    { agent: "CredentialsProvider", message: "Retrieving payment methods for user..." },
    { agent: "CredentialsProvider", message: "Generated secure payment token: tok_secure_123" },
    { agent: "ShoppingAgent", message: "PaymentMandate constructed and signed" },
    { agent: "PaymentProcessor", message: "Verifying PaymentMandate signature..." },
    { agent: "PaymentProcessor", message: "Transaction authorized. Amount: ₹4999" }
  ]
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const ap2Api = {
  async sendIntent(prompt: string): Promise<IntentResponse> {
    const res = await fetch(`${API_BASE}/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Backend not reachable');
    return await res.json();
  },

  async updateProduct(product: Product): Promise<void> {
    try {
      await fetch(`${API_BASE}/update-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: `prod_${Math.random().toString(36).substring(7)}`,
          name: product.name,
          price: product.price,
          currency: "INR",
          description: "",
          brand: product.brand || "",
          merchant: product.merchant || "CoffeeRoasters"
        })
      });
    } catch (e) {
      console.warn("Failed to update product on backend, continuing with frontend state only");
    }
  },

  async processPayment(paymentMethod: string): Promise<PaymentResponse> {
    const res = await fetch(`${API_BASE}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod })
    });
    if (!res.ok) throw new Error('Backend not reachable');
    return await res.json();
  }
};
