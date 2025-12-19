import { CheckCircle2, X } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    receiptId: string;
    amount: number;
  } | null;
}

export function ReceiptModal({ isOpen, onClose, data }: ReceiptModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400 mb-8">Your transaction has been verified by the Payment Processor Agent.</p>

          <div className="w-full bg-gray-900/50 rounded-lg p-4 mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Receipt ID</span>
              <span className="font-mono text-gray-300">{data.receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-emerald-400">₹{data.amount.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            DONE 
          </button>
        </div>
      </div>
    </div>
  );
}
