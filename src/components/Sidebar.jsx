import React from 'react';
import { RefreshCw, RotateCw, ArrowLeft, Shield } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function Sidebar() {
  const players = useGameStore((state) => state.players);
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  const winner = useGameStore((state) => state.winner);
  const boardSize = useGameStore((state) => state.boardSize);
  const maxWalls = useGameStore((state) => state.maxWalls);
  const wallOrientation = useGameStore((state) => state.wallOrientation);
  const errorMsg = useGameStore((state) => state.errorMsg);
  
  const mode = useGameStore((state) => state.mode);
  const roomId = useGameStore((state) => state.roomId);
  const playerId = useGameStore((state) => state.playerId);
  
  const toggleOrientation = useGameStore((state) => state.toggleOrientation);
  const resetGame = useGameStore((state) => state.resetGame);
  const setGamePhase = useGameStore((state) => state.setGamePhase);

  return (
    <div className="shrink-0 p-4 md:w-80 md:h-full md:p-8 flex flex-col gap-6 z-20 bg-[#13132B] border-b md:border-r border-white/5 shadow-2xl overflow-y-auto">
      <div className="flex items-center justify-between md:block">
          <div className="flex items-center gap-3 md:block">
            <button 
              onClick={() => setGamePhase('setup')}
              className="hidden md:flex items-center gap-2 text-xs font-bold text-indigo-400/60 hover:text-white mb-4 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Menu
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
                NEO<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">BLOCK</span>
              </h1>
              <p className="hidden md:block text-indigo-400/60 text-xs font-medium mt-1 tracking-widest uppercase">
                {boardSize}x{boardSize} Matrix
              </p>
            </div>
          </div>
          
          <button onClick={resetGame} className="md:hidden p-2 bg-white/5 rounded-lg text-white hover:bg-white/10">
             <RefreshCw size={20} />
          </button>
      </div>

      {mode === 'online' && (
        <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-3 -mt-2 flex items-center justify-between">
            <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">Room Code</span>
            <span className="font-mono font-bold text-white tracking-widest">{roomId}</span>
        </div>
      )}

      {/* Player Stats */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 md:mt-2">
         {players.map((p, idx) => (
           <div key={idx} 
                className={`p-3 md:p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                  ${currentPlayer === idx && winner === null
                    ? `bg-white/5 border-purple-500/50 shadow-[inset_0_0_20px_rgba(121,40,202,0.1)]` 
                    : 'bg-transparent border-white/5 opacity-60'}`}>
             
             {/* Active Indicator Line */}
             {currentPlayer === idx && winner === null && (
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.color}`}></div>
             )}

             <div className="flex items-center gap-3 mb-3">
               <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${p.color} flex items-center justify-center text-white shadow-lg`}>
                  <p.icon size={18} className="md:w-5 md:h-5" />
               </div>
               <div className="flex flex-col">
                 <span className="font-bold text-sm md:text-lg leading-tight text-white">
                    {p.name}
                    {mode === 'online' && p.uid === playerId && (
                      <span className="ml-2 text-[10px] align-middle font-bold bg-white/20 px-1.5 py-0.5 rounded text-white uppercase tracking-wider">YOU</span>
                    )}
                 </span>
                 {currentPlayer === idx && winner === null && <span className="text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-wider animate-pulse">Active</span>}
               </div>
             </div>
             
             <div className="bg-black/30 rounded-lg px-3 py-2 flex items-center justify-between border border-white/5">
               <span className="text-[10px] md:text-xs font-bold text-indigo-400/60 uppercase">Walls</span>
               <div className="flex gap-1">
                  {Array.from({length: maxWalls}).map((_, wIdx) => (
                     <div key={wIdx} className={`w-1 h-3 rounded-full transition-all duration-500 ${wIdx < p.walls ? (idx === 0 ? 'bg-pink-500 shadow-[0_0_5px_#ec4899]' : 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]') : 'bg-white/10'}`}></div>
                  ))}
               </div>
               <span className="text-xs font-mono font-bold ml-1 text-white">{p.walls}</span>
             </div>
           </div>
         ))}
      </div>

      {/* Controls */}
      <div className="mt-auto hidden md:flex flex-col gap-3">
           {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <Shield size={14} /> {errorMsg}
            </div>
          )}
           
           <button 
              onClick={toggleOrientation}
              className="w-full py-4 bg-[#1C1C33] hover:bg-[#252545] border border-white/10 rounded-xl flex items-center justify-center gap-3 font-bold text-white shadow-lg transition-all active:scale-95 group"
           >
              <RotateCw size={18} className={`${wallOrientation === 'v' ? 'rotate-90' : ''} transition-transform duration-300 text-purple-400 group-hover:text-purple-300`} />
              <span className="uppercase tracking-widest text-xs group-hover:text-purple-300">
                {wallOrientation === 'h' ? 'Horizontal' : 'Vertical'}
              </span>
           </button>

           <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setGamePhase('setup')} className="py-3 text-indigo-400/50 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 bg-white/5 rounded-lg">
                  Menu
              </button>
              <button onClick={resetGame} className="py-3 text-indigo-400/50 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 bg-white/5 rounded-lg">
                  <RefreshCw size={14} /> Reset
              </button>
           </div>
      </div>
    </div>
  );
}
