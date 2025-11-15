'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract';

export default function TodoForm({ provider, onCreated }: { provider?: ethers.BrowserProvider, onCreated?: () => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function create() {
    if (!provider) return alert('Connect wallet');
    if (!text || text.trim().length === 0) return alert('Empty todo');
    if (text.length > 200) return alert('Too long');

    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.createTodo(text);
      await tx.wait();
      setText('');
      onCreated?.();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4 border rounded bg-white">
      <input className="w-full p-2 border rounded" value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo (max 200 chars)" />
      <div className="mt-2 flex justify-end">
        <button onClick={create} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">{loading ? 'Creating...' : 'Create'}</button>
      </div>
    </div>
  );
}
