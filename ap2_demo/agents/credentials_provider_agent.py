import uuid

class CredentialsProviderAgent:
    def __init__(self, name="SecureVault"):
        self.name = name

    def get_payment_methods(self, user_id: str):
        print(f"[{self.name}] Fetching payment methods for user: {user_id}")
        return [
            {"alias": "HDFC Credit Card ending 1234", "id": "pm_1"},
            {"alias": "UPI (user@upi)", "id": "pm_2"}
        ]

    def generate_payment_token(self, payment_method_id: str, amount: float) -> str:
        token = f"tok_{uuid.uuid4().hex[:16]}"
        print(f"[{self.name}] Generated secure payment token: {token} for amount {amount}")
        return token
