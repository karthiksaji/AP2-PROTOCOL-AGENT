import os
import json
import uuid
from dotenv import load_dotenv
from openai import OpenAI
from mandates import CartMandate

# Load environment variables
load_dotenv()

class MerchantAgent:
    def __init__(self, name="ECOMSURFER"):
        self.name = name
        self.client = OpenAI(
            api_key=os.environ.get("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
        )

    def search_product(self, query: str):
        print(f"[{self.name}] Searching for product matching: '{query}'")
        
        system_prompt = """
You are a STRICT e-commerce product catalog engine.

MANDATORY RULES:
1. If the user mentions a specific brand or model name
   (example: "Samsung S24", "iPhone 15", "Redmi Note 13"),
   return ONLY that exact product.
2. DO NOT suggest alternative brands or similar products.
3. If variants exist (RAM, storage, color, connectivity),
   return MULTIPLE VARIANTS of the SAME PRODUCT with different prices.
4. If the exact product does NOT exist, return an EMPTY products array.
5. Prices must be realistic Indian market prices (INR). Use consistent, standard MSRP values to ensure the same price is returned for the same product every time.
6. If the user specifies a budget or spending limit, RETURN ONLY products that fit within that limit.
7. DO NOT fluctuate prices. Be deterministic.
8. Respond with VALID JSON ONLY. No explanations.

TASK:
Interpret the user query as an exact product lookup. Determine if a spending limit is mentioned.
Return UP TO 3 realistic variants of the SAME product, ordered by price in ASCENDING order.

OUTPUT FORMAT:
{
  "products": [
    {
      "name": "Exact product name with variant",
      "brand": "Brand",
      "price": 0,
      "description": "Short description"
    }
  ]
}
"""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": query,
                    }
                ],
                model="meta-llama/llama-3.3-70b-instruct",
                response_format={"type": "json_object"},
                temperature=0,
                seed=42,
            )
            
            response_content = chat_completion.choices[0].message.content
            print(f"[{self.name}] Raw LLM Response: {response_content[:100]}...")
            
            data = json.loads(response_content)
            products = data.get("products", [])
            
            if products:
                # Process all products
                results = []
                for p in products:
                    results.append({
                        "product_id": f"prod_{uuid.uuid4().hex[:8]}",
                        "name": p['name'],
                        "price": float(p['price']),
                        "currency": "INR",
                        "description": p.get('description', ''),
                        "brand": p.get('brand', 'Unknown Brand'),
                        "merchant": self.name
                    })
                
                # Limit to maximum 3 results
                results = results[:3]
                
                best_match = results[0]
                print(f"[{self.name}] Found {len(results)} matches. Best match: {best_match['name']}")
                return results
            else:
                print(f"[{self.name}] No products found in LLM response.")
                return None

        except Exception as e:
            print(f"[{self.name}] Error fetching from OpenRouter: {e}")
            return None

    def create_cart_mandate(self, product) -> CartMandate:
        cart_id = f"cart_{uuid.uuid4().hex[:8]}"
        signature = f"sig_merch_{uuid.uuid4().hex[:8]}"
        
        print(f"[{self.name}] Creating CartMandate for {product['name']} at {product['price']}")
        
        return CartMandate(
            cart_id=cart_id,
            product_name=product['name'],
            price=product['price'],
            merchant_signature=signature
        )
