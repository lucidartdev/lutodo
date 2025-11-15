'use client';
import React, { useEffect, useState } from 'react';
import { getReadOnlyContract } from '../lib/contract';
import TodoItem from './TodoItem';
import { ethers } from 'ethers';

export default function TodoList({ provider, userAddress }: { provider?: ethers.BrowserProvider, userAddress?: string }) {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const contract = getReadOnlyContract();
      const addr = userAddress || (typeof window !== 'undefined' && (window as any).ethereum ? (await (await (new ethers.BrowserProvider((window as any).ethereum)).getSigner()).getAddress()) : undefined);
      if (!addr) { setTodos([]); setLoading(false); return; }
      const res = await contract.getTodos(addr);
      const parsed = res.map((t: any) => ({
        id: Number(t.id.toString()),
        text: t.text,
        completed: t.completed,
        deleted: t.deleted,
        timestamp: Number(t.timestamp.toString())
      }));
      setTodos(parsed.reverse()); // newest first
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [userAddress]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Your Todos</h3>
      {loading ? <div>Loading...</div> : todos.length === 0 ? <div className="text-sm text-gray-500">No todos</div> : (
        <div className="space-y-3">
          {todos.map(t => <TodoItem key={t.id} todo={t} provider={provider} onUpdated={load} />)}
        </div>
      )}
    </div>
  );
}
