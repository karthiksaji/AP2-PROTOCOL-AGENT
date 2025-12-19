import { ShoppingBag, Store, ShieldCheck, CreditCard } from 'lucide-react';
import clsx from 'clsx';

interface AgentTimelineProps {
  currentStep: number; // 0: Idle, 1: Shopping, 2: Merchant, 3: Credentials, 4: Payment
}

export function AgentTimeline({ currentStep }: AgentTimelineProps) {
  const steps = [
    { id: 1, name: 'Shopping Agent', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 2, name: 'Merchant Agent', icon: Store, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { id: 3, name: 'Credentials Provider', icon: ShieldCheck, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { id: 4, name: 'Payment Processor', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  ];

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center relative max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500/50 -z-10 transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, (currentStep - 1) / (steps.length - 1) * 100)}%` }}
        />

        {steps.map((step) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div
                className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isActive ? `${step.bg} ${step.border} ${step.color}` : "bg-surface border-gray-800 text-gray-600",
                  isCurrent && "ring-4 ring-indigo-500/20 scale-110"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className={clsx(
                "text-sm font-medium transition-colors duration-300",
                isActive ? "text-gray-200" : "text-gray-600"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
