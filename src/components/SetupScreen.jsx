import React from 'react';
import { Grid, Play } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function SetupScreen() {
  const initGame = useGameStore((state) => state.initGame);

  return (
    <div className="h-screen w-screen bg-[#0B0B15] text-white flex flex-col items-center p-4 selection:bg-purple-500/30 overflow-y-auto overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0B0B15] to-[#0B0B15]"></div>
      <div className="fixed inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center my-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          NEO<span className="text-white">BLOCK</span>
        </h1>
        <p className="text-indigo-300/60 uppercase tracking-[0.5em] text-sm mb-12">Can you reach the end?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { size: 15, walls: 7, label: "CLASSIC", desc: "Standard Warfare" },
            { size: 8, walls: 4, label: "BLITZ", desc: "Close Quarters" },
            { size: 6, walls: 3, label: "SUDDEN DEATH", desc: "Instant Conflict" }
          ].map((mode) => (
            <button
              key={mode.size}
              onClick={() => initGame(mode.size, mode.walls)}
              className="group relative bg-[#13132B] border border-white/10 hover:border-purple-500/50 p-8 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-16 h-16 bg-white/5 rounded-xl mb-6 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                <Grid size={32} />
              </div>
              
              <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                {mode.size}x{mode.size}
              </h3>
              
              <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-indigo-200 mb-4">
                {mode.label}
              </div>
              
              <p className="text-gray-400 text-sm">{mode.walls} Barricades</p>
              <p className="text-gray-500 text-xs mt-1">{mode.desc}</p>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <Play size={20} className="text-purple-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
