import urllib.request
import json

def verify_intent():
    url = "http://localhost:8000/intent"
    payload = json.dumps({"prompt": "I want a gaming laptop"}).encode('utf-8')
    
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    
    try:
        print(f"Sending request to {url}...")
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                print("\n--- Server Response ---")
                print(json.dumps(data, indent=2))
                
                product = data.get("product")
                if product:
                    print("\n--- Verification ---")
                    print(f"Name: {product.get('name')}")
                    print(f"Merchant: {product.get('merchant')}")
                    print(f"Brand: {product.get('brand')}")
                    
                    if product.get('merchant') or product.get('brand'):
                        print("SUCCESS: Merchant/Brand data is present.")
                    else:
                        print("FAILURE: Merchant/Brand data is MISSING.")
                else:
                    print("FAILURE: No product returned.")
            else:
                print(f"FAILURE: Server returned status code {response.status}")
            
    except Exception as e:
        print(f"FAILURE: Could not connect to server. {e}")

if __name__ == "__main__":
    verify_intent()
