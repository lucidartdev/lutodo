'use client';
import React, { useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { ethers } from 'ethers';

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>();
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>();

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">On-chain Todo List</h1>
        <ConnectWallet onConnect={(p) => { setProvider(p); (async ()=> { try { const s = await p.getSigner(); const a = await s.getAddress(); setConnectedAddress(a); } catch { setConnectedAddress(undefined); } })(); }} />
      </header>

      <main className="space-y-6">
        <TodoForm provider={provider} onCreated={() => { /* TodoList will refresh via event or prop callback */ window.location.reload(); }} />
        <TodoList provider={provider} userAddress={connectedAddress} />
      </main>
    </div>
  );
}
