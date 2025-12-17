import React, { useState } from 'react';
import { Copy, Loader2, ArrowLeft } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function Lobby() {
  const roomId = useGameStore((state) => state.roomId);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-screen bg-[#0B0B15] text-white flex flex-col items-center justify-center p-4 selection:bg-purple-500/30 relative">
       <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0B0B15] to-[#0B0B15]"></div>
       
       <button 
          onClick={() => setGamePhase('setup')}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-indigo-400 hover:text-white transition-colors uppercase text-sm font-bold tracking-widest"
       >
          <ArrowLeft size={16} /> Quit Lobby
       </button>

       <div className="relative z-10 max-w-md w-full bg-[#13132B] border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
             <Loader2 size={32} className="text-purple-400 animate-spin" />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-white">Waiting for Opponent</h2>
          <p className="text-indigo-300 mb-8">Share this code with your friend to start.</p>

          <div className="w-full bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4 mb-8">
             <span className="text-2xl font-mono font-bold tracking-widest text-purple-400">{roomId}</span>
             <button 
                onClick={copyCode}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-indigo-300 hover:text-white"
                title="Copy Code"
             >
                {copied ? <span className="text-xs font-bold text-green-400">COPIED</span> : <Copy size={20} />}
             </button>
          </div>

          <p className="text-xs text-indigo-500/50 uppercase tracking-widest">
             Game will start automatically
          </p>
       </div>
    </div>
  );
}
