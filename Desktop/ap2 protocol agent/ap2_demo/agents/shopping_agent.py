import uuid
from mandates import IntentMandate, PaymentMandate
from agents.merchant_agent import MerchantAgent
from agents.credentials_provider_agent import CredentialsProviderAgent
from agents.payment_processor_agent import PaymentProcessorAgent

class ShoppingAgent:
    def __init__(self, 
                 merchant: MerchantAgent, 
                 credentials_provider: CredentialsProviderAgent, 
                 payment_processor: PaymentProcessorAgent,
                 name="ShopperBot"):
        self.name = name
        self.merchant = merchant
        self.credentials_provider = credentials_provider
        self.payment_processor = payment_processor
        self.current_cart_mandate = None
        self.logs = []

    def _log(self, agent, message):
        print(f"[{agent}] {message}")
        self.logs.append({"agent": agent, "message": message})

    def process_intent(self, user_prompt: str):
        self.logs = [] # Clear logs for new intent
        self._log(self.name, f"Processing User Request: '{user_prompt}'")
        
        # 1. Create Intent
        intent_id = f"intent_{uuid.uuid4().hex[:8]}"
        intent = IntentMandate(intent_id=intent_id, user_prompt=user_prompt)
        self._log(self.name, f"Created IntentMandate: {intent.intent_id}")

        # 2. Search Product via Merchant
        products = self.merchant.search_product(user_prompt)
        
        if not products:
            self._log(self.merchant.name, f"No product found for query: '{user_prompt}'")
            return {
                "product": None,
                "alternatives": [],
                "agentLogs": self.logs
            }

        best_match = products[0]
        self._log(self.merchant.name, f"Found {len(products)} matches. Best: {best_match['name']} ({best_match['price']} INR)")

        # 3. Get Cart Mandate (for best match initially)
        cart_mandate = self.merchant.create_cart_mandate(best_match)
        self.current_cart_mandate = cart_mandate
        self._log(self.merchant.name, f"CartMandate signed for {cart_mandate.product_name}")
        self._log(self.name, f"Received CartMandate: {cart_mandate.cart_id}")

        return {
            "product": best_match,
            "alternatives": products,
            "agentLogs": self.logs
        }

    def process_payment(self, payment_method_id: str):
        # Continue logging from where we left off, or start new if needed. 
        # For API response, we usually return just the new logs.
        current_logs_start_index = len(self.logs)
        
        if not self.current_cart_mandate:
            self._log(self.name, "Error: No active cart found. Cannot process payment.")
            return {
                "status": "FAILED",
                "receiptId": None,
                "agentLogs": self.logs[current_logs_start_index:]
            }

        cart_mandate = self.current_cart_mandate
        
        # 4. Get Payment Methods (Simulated selection based on ID)
        # In a real app, we'd validate the ID. For demo, we just use it.
        self._log(self.credentials_provider.name, "Retrieving payment methods...")
        
        # 5. Generate Token
        token = self.credentials_provider.generate_payment_token(payment_method_id, cart_mandate.price)
        self._log(self.credentials_provider.name, f"Generated secure token for {cart_mandate.price}")

        # 6. Create Payment Mandate
        payment_id = f"pay_{uuid.uuid4().hex[:8]}"
        user_signature = f"sig_user_{uuid.uuid4().hex[:8]}"
        
        payment_mandate = PaymentMandate(
            payment_id=payment_id,
            cart_id=cart_mandate.cart_id,
            amount=cart_mandate.price,
            payment_token=token,
            user_signature=user_signature
        )
        self._log(self.name, f"PaymentMandate constructed and signed: {payment_mandate.payment_id}")

        # 7. Execute Payment
        self._log(self.payment_processor.name, "Verifying PaymentMandate signature...")
        receipt = self.payment_processor.process_payment(payment_mandate)
        self._log(self.payment_processor.name, f"Transaction authorized. Receipt: {receipt['transaction_id']}")
        
        return {
            "status": receipt["status"],
            "receiptId": receipt["transaction_id"],
            "agentLogs": self.logs[current_logs_start_index:]
        }

    # Keep old method for CLI compatibility if needed, or update main.py
    def handle_user_prompt(self, user_prompt: str):
        # Wrapper for CLI compatibility
        intent_res = self.process_intent(user_prompt)
        if not intent_res.get('product'):
            return {"status": "FAILED", "message": "Product not found"}
        
        # Auto-select first method for CLI
        return self.process_payment("card_1")
