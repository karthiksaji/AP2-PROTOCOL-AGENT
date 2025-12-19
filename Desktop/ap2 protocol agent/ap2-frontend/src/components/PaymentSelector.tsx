import { useState } from 'react';
import { CreditCard, Wallet, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

interface PaymentSelectorProps {
  amount: number;
  onPay: (methodId: string) => void;
  onBack?: () => void;
  isLoading: boolean;
  isAuto?: boolean;
}

export function PaymentSelector({ amount, onPay, onBack, isLoading, isAuto = false }: PaymentSelectorProps) {
  const [selected, setSelected] = useState('card_1');

  const allMethods = [
    { id: 'card_1', name: 'HDFC Credit Card', last4: '1234', icon: CreditCard },
    { id: 'upi_1', name: 'UPI', alias: 'user@upi', icon: Wallet },
  ];

  // Filter out UPI if in auto mode
  const methods = isAuto 
    ? allMethods.filter(m => m.id !== 'upi_1')
    : allMethods;

  return (
    <div className="w-full bg-surface border border-border rounded-xl p-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Back Button - Only in Manual Mode */}
      {!isAuto && onBack && (
        <button
          onClick={onBack}
          disabled={isLoading}
          className="group flex items-center gap-2 px-4 py-2 mb-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-indigo-500/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
          <span className="text-sm text-gray-400 group-hover:text-indigo-400 transition-colors">Back to Products</span>
        </button>
      )}
      
      <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
      
      <div className="space-y-3 mb-6">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;
          
          return (
            <div
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={clsx(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                isSelected 
                  ? "bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/50" 
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
              )}
            >
              <div className={clsx("p-2 rounded-full", isSelected ? "bg-indigo-500/20" : "bg-gray-800")}>
                <Icon className={clsx("w-5 h-5", isSelected ? "text-indigo-400" : "text-gray-400")} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-200">{method.name}</p>
                <p className="text-sm text-gray-500">{method.last4 ? `•••• ${method.last4}` : method.alias}</p>
              </div>
              <div className={clsx(
                "w-4 h-4 rounded-full border flex items-center justify-center",
                isSelected ? "border-indigo-500" : "border-gray-600"
              )}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onPay(selected)}
        disabled={isLoading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
      </button>
    </div>
  );
}
