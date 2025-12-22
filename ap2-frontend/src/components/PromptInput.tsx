import React, { useState } from 'react';
import { Send, Sparkles, SlidersHorizontal } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string, isAuto: boolean, maxAmount: number) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isAuto, setIsAuto] = useState(false);
  const [maxAmount, setMaxAmount] = useState(100000);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt, isAuto, maxAmount);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center mb-4">
          <Sparkles className="absolute left-4 w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="What would you like to buy today? (e.g., 'I want a coffee machine')"
            className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-24 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors ${showFilters ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-gray-600 bg-transparent hover:border-indigo-500 hover:bg-indigo-500/5 text-gray-400'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-black/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    Filter Settings
                  </h3>
                </div>
                <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <span className="text-xs text-indigo-400 font-medium">Advanced</span>
                </div>
              </div>

              {/* Auto-Purchase Toggle */}
              <div className="mb-6 p-4 bg-black/20 border border-gray-700/30 rounded-xl hover:border-indigo-500/30 transition-colors">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`relative w-12 h-6 rounded-full transition-colors ${isAuto ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isAuto ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${isAuto ? 'text-white' : 'text-gray-300'}`}>
                        Auto-Purchase
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">Skip human approval for faster checkout</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isAuto} 
                    onChange={(e) => setIsAuto(e.target.checked)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Budget Control */}
              <div className="p-4 bg-black/20 border border-gray-700/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Maximum Budget</label>
                    <p className="text-xs text-gray-500 mt-0.5">Auto-approval spending limit</p>
                  </div>
                  <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <span className="text-sm font-bold text-indigo-400">₹{maxAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min="500"
                      max="200000"
                      step="500"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
                      style={{
                        background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${((maxAmount - 500) / (200000 - 500)) * 100}%, rgb(55 65 81) ${((maxAmount - 500) / (200000 - 500)) * 100}%, rgb(55 65 81) 100%)`
                      }}
                    />
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="flex gap-2">
                    {[10000, 50000, 100000, 200000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setMaxAmount(amount)}
                        className={`flex-1 px-2 py-1.5 text-xs rounded-lg transition-all ${
                          maxAmount === amount 
                            ? 'bg-indigo-600 text-white font-medium' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                        }`}
                      >
                        ₹{(amount / 1000)}K
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
