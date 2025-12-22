import { useState, useRef } from 'react';
import { Bot, ArrowLeft } from 'lucide-react';
import { PromptInput } from './components/PromptInput';
import { AgentTimeline } from './components/AgentTimeline';
import { AgentLogsPanel } from './components/AgentLogsPanel';
import { ProductCard } from './components/ProductCard';
import { ProductCarousel } from './components/ProductCarousel';
import { PaymentSelector } from './components/PaymentSelector';
import { ReceiptModal } from './components/ReceiptModal';
import { useAgentLogs } from './hooks/useAgentLogs';
import { ap2Api, Product } from './api/ap2Api';

function App() {
  const [step, setStep] = useState(0); // 0: Idle, 1: Shopping, 2: Merchant, 3: Credentials, 4: Payment
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [receipt, setReceipt] = useState<{ receiptId: string; amount: number } | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  
  const productCardRef = useRef<HTMLDivElement>(null);
  
  const { logs, addLogs, clearLogs } = useAgentLogs();

  const handleIntent = async (prompt: string, isAuto: boolean, maxAmount: number) => {
    setIsLoading(true);
    setIsAutoMode(isAuto);
    clearLogs();
    setStep(1); // Shopping Agent Active

    try {
      const response = await ap2Api.sendIntent(prompt);
      
      // Simulate step progression based on logs or just time
      addLogs(response.agentLogs.slice(0, 2)); // Shopping Agent logs
      setTimeout(() => setStep(2), 1000); // Merchant Agent Active
      
      setTimeout(() => {
        addLogs(response.agentLogs.slice(2)); // Merchant Agent logs
        const initialProduct = response.product;
        setProduct(initialProduct);
        setAlternatives(response.alternatives || [initialProduct]);
        setIsLoading(false); // Clear loading to show products
        
        if (isAuto) {
          // Scroll to product card to show selection
          setTimeout(() => {
            productCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);

          if (initialProduct.price <= maxAmount) {
             // Auto-execute payment with Card (UPI not allowed for auto)
             // Capture the price to pass to handlePayment
             const productPrice = initialProduct.price;
             setTimeout(() => {
                handlePayment('card_1', productPrice); 
             }, 2000);
          } else {
             // Price exceeds limit, fallback to manual
             setIsAutoMode(false);
             addLogs([{ 
               agent: "ShoppingAgent", 
               message: `⚠️ Auto-purchase halted: Price (₹${initialProduct.price}) exceeds limit (₹${maxAmount}). Waiting for user approval.` 
             }]);
          }
        }
      }, 2500);
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setStep(0);
    }
  };

  const handlePayment = async (methodId: string, priceOverride?: number) => {
    setIsLoading(true);
    setStep(3); // Credentials Provider Active
    
    // Capture the current product price NOW, not in the setTimeout
    const finalAmount = priceOverride || product?.price || 0;

    try {
      const response = await ap2Api.processPayment(methodId);
      
      addLogs(response.agentLogs.slice(0, 2)); // Credentials logs
      setTimeout(() => setStep(4), 1500); // Payment Processor Active
      
      setTimeout(() => {
        addLogs(response.agentLogs.slice(2)); // Payment logs
        setReceipt({
          receiptId: response.receiptId,
          amount: finalAmount
        });
        setIsLoading(false);
      }, 3500);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const resetDemo = () => {
    setStep(0);
    setProduct(null);
    setAlternatives([]);
    setReceipt(null);
    clearLogs();
  };

  const handleProductSelect = async (selectedProduct: Product) => {
    setProduct(selectedProduct);
    // Update backend cart mandate with the new product
    await ap2Api.updateProduct(selectedProduct);
  };

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center gap-3 pb-6 border-b border-border">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AP2 Commerce Demo</h1>
            <p className="text-gray-400 text-sm">Agent Payments Protocol Visualization</p>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interaction Area */}
          <div className="lg:col-span-7 space-y-8">
            <AgentTimeline currentStep={step} />
            
            <div className="min-h-[400px] flex flex-col justify-center">
              {step === 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Experience the Future of<br />Agentic Commerce
                  </h2>
                  <PromptInput onSubmit={handleIntent} isLoading={isLoading} />
                </div>
              )}

              {step >= 1 && step < 3 && product && !isLoading && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Back Button - Only in Manual Mode */}
                  {!isAutoMode && (
                    <button
                      onClick={() => {
                        setStep(0);
                        setProduct(null);
                        setAlternatives([]);
                        clearLogs();
                      }}
                      className="group flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-indigo-500/50 rounded-xl transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-sm text-gray-400 group-hover:text-indigo-400 transition-colors">Back to Search</span>
                    </button>
                  )}
                  
                  <h3 className="text-xl font-semibold text-gray-200">Found {alternatives.length} Matches</h3>
                  <ProductCarousel 
                    products={alternatives} 
                    selectedProduct={product}
                    onSelect={handleProductSelect}
                  />
                  
                  {/* Selected Product Detail & Action */}
                  <div className="mt-8 pt-6 border-t border-gray-800" ref={productCardRef}>
                     <ProductCard 
                        product={product} 
                        onProceed={() => setStep(3)} 
                        isAutoPurchasing={isAutoMode}
                     />
                  </div>
                </div>
              )}

              {step >= 3 && !receipt && (
                <PaymentSelector 
                  amount={product?.price || 0} 
                  onPay={handlePayment} 
                  onBack={() => setStep(2)}
                  isLoading={isLoading}
                  isAuto={isAutoMode}
                />
              )}
            </div>
          </div>

          {/* Right Column: Live Logs */}
          <div className="lg:col-span-5 h-[600px] sticky top-6">
            <AgentLogsPanel logs={logs} />
          </div>
        </div>

      </div>

      <ReceiptModal 
        isOpen={!!receipt} 
        onClose={resetDemo} 
        data={receipt} 
      />
    </div>
  );
}

export default App;
