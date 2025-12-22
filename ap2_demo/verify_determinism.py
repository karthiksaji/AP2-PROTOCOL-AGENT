from agents.merchant_agent import MerchantAgent
import json
import time

def verify_determinism():
    agent = MerchantAgent()
    query = "iPhone 15 128GB"
    
    print(f"Testing determinism for query: '{query}'")
    
    responses = []
    for i in range(3):
        print(f"Attempt {i+1}...")
        results = agent.search_product(query)
        if results:
            # Extract names and prices for comparison
            data = [{"name": p['name'], "price": p['price']} for p in results]
            responses.append(data)
        else:
            responses.append(None)
        time.sleep(1) # Small delay between calls

    # Compare results
    consistent = True
    for i in range(1, len(responses)):
        if responses[i] != responses[0]:
            print(f"\nINCONSISTENCY DETECTED at attempt {i+1}!")
            print(f"First result: {json.dumps(responses[0], indent=2)}")
            print(f"Attempt {i+1} result: {json.dumps(responses[i], indent=2)}")
            consistent = False
            break
    
    if consistent and responses[0] is not None:
        print("\nSUCCESS: All searches returned identical results and prices!")
        for p in responses[0]:
            print(f"- {p['name']}: {p['price']} INR")
    elif responses[0] is None:
        print("\n⚠️ Error: No results returned from API.")

if __name__ == "__main__":
    verify_determinism()
