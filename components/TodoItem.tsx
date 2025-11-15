'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract';

export default function TodoItem({ todo, provider, onUpdated }: { todo: any, provider?: ethers.BrowserProvider, onUpdated?: () => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!provider) return alert('Connect wallet');
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.toggleCompleted(todo.id);
      await tx.wait();
      onUpdated?.();
    } catch (e:any) { console.error(e); alert(e?.message || 'Failed'); }
    finally { setLoading(false); }
  }

  async function del() {
    if (!provider) return alert('Connect wallet');
    if (!confirm('Delete this todo?')) return;
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.deleteTodo(todo.id);
      await tx.wait();
      onUpdated?.();
    } catch (e:any) { console.error(e); alert(e?.message || 'Failed'); }
    finally { setLoading(false); }
  }

  async function saveEdit() {
    if (!provider) return alert('Connect wallet');
    if (!text || text.trim().length === 0) return alert('Empty');
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.editTodo(todo.id, text);
      await tx.wait();
      setEditing(false);
      onUpdated?.();
    } catch (e:any) { console.error(e); alert(e?.message || 'Failed'); }
    finally { setLoading(false); }
  }

  if (todo.deleted) {
    return (
      <div className="p-3 border rounded bg-gray-50 text-gray-400 italic">[deleted]</div>
    );
  }

  return (
    <div className="p-3 border rounded bg-white flex items-start justify-between">
      <div>
        <div className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>{editing ? <input className="border p-1" value={text} onChange={(e)=>setText(e.target.value)} /> : todo.text}</div>
        <div className="text-xs text-gray-500 mt-1">{new Date(todo.timestamp * 1000).toLocaleString()}</div>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <button onClick={toggle} disabled={loading} className="px-2 py-1 border rounded">{todo.completed ? 'Undo' : 'Done'}</button>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={saveEdit} disabled={loading} className="px-2 py-1 bg-green-600 text-white rounded">Save</button>
            <button onClick={() => setEditing(false)} className="px-2 py-1 border rounded">Cancel</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={()=>setEditing(true)} className="px-2 py-1 border rounded">Edit</button>
            <button onClick={del} className="px-2 py-1 border rounded text-red-600">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
