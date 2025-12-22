import { useEffect, useRef } from 'react';
import { LogEntry } from '../hooks/useAgentLogs';
import { Terminal } from 'lucide-react';
import clsx from 'clsx';

interface AgentLogsPanelProps {
  logs: LogEntry[];
}

export function AgentLogsPanel({ logs }: AgentLogsPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentColor = (agentName: string) => {
    if (agentName.includes('Shopping')) return 'text-blue-400 shadow-blue-500/50';
    if (agentName.includes('Merchant')) return 'text-purple-400 shadow-purple-500/50';
    if (agentName.includes('Credentials')) return 'text-yellow-400 shadow-yellow-500/50';
    if (agentName.includes('Payment')) return 'text-emerald-400 shadow-emerald-500/50';
    return 'text-gray-400';
  };

  return (
    <div className="w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/5">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
            <Terminal className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100 tracking-wide">AGENT TERMINAL</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-medium text-emerald-500/80 uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">
          v2.0.4
        </div>
      </div>
      
      {/* Logs Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4 opacity-50">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 animate-spin-slow" />
            <p className="text-xs tracking-widest uppercase">Awaiting Protocol Initialization...</p>
          </div>
        )}
        
        {logs.map((log) => (
          <div key={log.id} className="group flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col items-center pt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-indigo-500 transition-colors duration-300" />
               <div className="w-px h-full bg-gray-800/50 my-1 group-last:hidden" />
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex items-baseline justify-between mb-1">
                <span className={clsx("text-xs font-bold tracking-wider uppercase drop-shadow-sm", getAgentColor(log.agent))}>
                  {log.agent}
                </span>
                <span className="text-[10px] text-gray-600 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3 })}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm border-l-2 border-white/5 pl-3 py-1 group-hover:border-indigo-500/30 transition-colors duration-300 bg-white/[0.02] rounded-r-lg">
                {log.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
