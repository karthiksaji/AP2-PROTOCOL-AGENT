from agents.shopping_agent import ShoppingAgent
from agents.merchant_agent import MerchantAgent
from agents.credentials_provider_agent import CredentialsProviderAgent
from agents.payment_processor_agent import PaymentProcessorAgent

def main():
    print("Initializing AP2 Protocol Simulation...")
    print("---------------------------------------")

    # Instantiate Agents
    merchant = MerchantAgent()
    cred_provider = CredentialsProviderAgent()
    payment_processor = PaymentProcessorAgent()
    
    shopping_agent = ShoppingAgent(
        merchant=merchant,
        credentials_provider=cred_provider,
        payment_processor=payment_processor
    )

    # Simulation
    print("\nEnter your shopping request (e.g., 'I want a gaming laptop'):")
    user_prompt = input("> ")
    if not user_prompt:
        user_prompt = "I want to buy a coffee machine"
    
    print(f"\nUser: {user_prompt}")
    
    result = shopping_agent.handle_user_prompt(user_prompt)

    print("\n--- Final Purchase Confirmation ---")
    print(f"Status: {result['status']}")
    print(f"Transaction ID: {result['transaction_id']}")
    print(f"Amount Charged: {result['amount']}")
    print(f"Message: {result['message']}")
    print("---------------------------------------")

if __name__ == "__main__":
    main()
