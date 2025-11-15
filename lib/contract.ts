import { ethers } from 'ethers';
import abi from './abi.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export function getReadOnlyProvider() {
  if (process.env.NEXT_PUBLIC_RPC) return new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC);
  if (typeof window !== 'undefined' && (window as any).ethereum) return new ethers.BrowserProvider((window as any).ethereum);
  return ethers.getDefaultProvider();
}

export function getContract(signerOrProvider: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi as any, signerOrProvider as any);
}

export function getReadOnlyContract() {
  const p = getReadOnlyProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, abi as any, p as any);
}
