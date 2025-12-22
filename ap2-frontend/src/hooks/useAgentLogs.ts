import { useState, useCallback } from 'react';
import { AgentLog } from '../api/ap2Api';

export interface LogEntry extends AgentLog {
  id: string;
  timestamp: number;
}

export function useAgentLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLogs = useCallback((newLogs: AgentLog[]) => {
    const timestampedLogs = newLogs.map(log => ({
      ...log,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    }));
    
    // Add logs one by one with a slight delay to simulate streaming
    timestampedLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, index * 600); // Stagger logs by 600ms
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLogs, clearLogs };
}
