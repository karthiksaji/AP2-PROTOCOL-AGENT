from mandates import PaymentMandate

class PaymentProcessorAgent:
    def __init__(self, name="GlobalPay"):
        self.name = name

    def process_payment(self, mandate: PaymentMandate):
        print(f"[{self.name}] Received PaymentMandate: {mandate.payment_id}")
        print(f"[{self.name}] Verifying token {mandate.payment_token} for amount {mandate.amount}...")
        
        # Simulate processing
        if mandate.amount > 0:
            print(f"[{self.name}] Transaction authorized.")
            return {
                "status": "SUCCESS",
                "transaction_id": f"txn_{mandate.payment_id}",
                "amount": mandate.amount,
                "message": "Payment processed successfully"
            }
        else:
            return {
                "status": "FAILED",
                "message": "Invalid amount"
            }
