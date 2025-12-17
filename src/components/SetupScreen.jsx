import React, { useState } from 'react';
import { Grid, Play, Users, Globe, ArrowRight } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function SetupScreen() {
  const initLocalGame = useGameStore((state) => state.initLocalGame);
  const createOnlineRoom = useGameStore((state) => state.createOnlineRoom);
  const joinOnlineRoom = useGameStore((state) => state.joinOnlineRoom);
  const errorMsg = useGameStore((state) => state.errorMsg);

  const [view, setView] = useState('menu'); // 'menu', 'local', 'online'
  const [joinCode, setJoinCode] = useState('');

  // Local Game Options
  const localOptions = [
    { size: 15, walls: 7, label: "CLASSIC", desc: "Standard Warfare" },
    { size: 8, walls: 4, label: "BLITZ", desc: "Close Quarters" },
    { size: 6, walls: 3, label: "SUDDEN DEATH", desc: "Instant Conflict" }
  ];

  return (
    <div className="h-screen w-screen bg-[#0B0B15] text-white flex flex-col items-center p-4 selection:bg-purple-500/30 overflow-y-auto overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0B0B15] to-[#0B0B15]"></div>
      <div className="fixed inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center my-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          NEO<span className="text-white">BLOCK</span>
        </h1>
        <p className="text-indigo-300/60 uppercase tracking-[0.5em] text-sm mb-12">System Configuration</p>

        {/* ERROR MESSAGE */}
        {errorMsg && (
            <div className="mb-6 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold animate-bounce">
                {errorMsg}
            </div>
        )}

        {/* STEP 1: MAIN MENU */}
        {view === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button onClick={() => setView('local')} className="group bg-[#13132B] border border-white/10 p-8 rounded-3xl hover:border-purple-500/50 hover:bg-white/5 transition-all text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Users size={48} className="mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-2">Local Match</h3>
                    <p className="text-gray-400">Play on the same device</p>
                </button>
                <button onClick={() => setView('online')} className="group bg-[#13132B] border border-white/10 p-8 rounded-3xl hover:border-cyan-500/50 hover:bg-white/5 transition-all text-left relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Globe size={48} className="mb-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-2">Multiplayer</h3>
                    <p className="text-gray-400">Create or join online room</p>
                </button>
            </div>
        )}

        {/* STEP 2: LOCAL SETUP */}
        {view === 'local' && (
            <div className="w-full">
                <button onClick={() => setView('menu')} className="mb-6 text-indigo-400 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={14} /> Back
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {localOptions.map((mode) => (
                    <button
                    key={mode.size}
                    onClick={() => initLocalGame(mode.size, mode.walls)}
                    className="group relative bg-[#13132B] border border-white/10 hover:border-purple-500/50 p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                    >
                    <div className="w-16 h-16 bg-white/5 rounded-xl mb-6 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                        <Grid size={32} />
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400">
                        {mode.size}x{mode.size}
                    </h3>
                    <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-indigo-200 mb-4">{mode.label}</div>
                    <p className="text-gray-500 text-xs">{mode.desc}</p>
                    </button>
                ))}
                </div>
            </div>
        )}

        {/* STEP 2: ONLINE SETUP */}
        {view === 'online' && (
             <div className="w-full max-w-md bg-[#13132B] border border-white/10 p-8 rounded-3xl">
                <button onClick={() => setView('menu')} className="mb-6 text-indigo-400 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <ArrowRight className="rotate-180" size={14} /> Back
                </button>
                
                <h3 className="text-xl font-bold text-white mb-6">Create Room</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                     <button onClick={() => createOnlineRoom(15, 7)} className="p-4 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-xl text-center transition-all">
                        <span className="block font-bold text-white">Classic</span>
                        <span className="text-xs text-gray-400">15x15</span>
                     </button>
                     <button onClick={() => createOnlineRoom(8, 4)} className="p-4 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-xl text-center transition-all">
                        <span className="block font-bold text-white">Blitz</span>
                        <span className="text-xs text-gray-400">8x8</span>
                     </button>
                </div>

                <div className="h-px bg-white/10 w-full mb-8"></div>

                <h3 className="text-xl font-bold text-white mb-4">Join Room</h3>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono tracking-widest placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                        maxLength={6}
                    />
                    <button 
                        onClick={() => joinOnlineRoom(joinCode)}
                        disabled={joinCode.length < 6}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        JOIN
                    </button>
                </div>
             </div>
        )}
      </div>
    </div>
  );
}
