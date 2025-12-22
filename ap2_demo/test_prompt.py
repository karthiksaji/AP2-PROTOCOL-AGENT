from agents.merchant_agent import MerchantAgent
import json

def test_prompt():
    agent = MerchantAgent()
    query = "Redmi Note 13 under 25000"
    print(f"Testing query: '{query}'")
    results = agent.search_product(query)
    
    if results:
        print("\nFound Products (should be ascending and <= 80000):")
        for p in results:
            print(f"- {p['name']}: {p['price']} INR")
    else:
        print("\nNo products found.")

if __name__ == "__main__":
    test_prompt()
