import React from 'react';
import { Trophy } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function WinnerOverlay() {
  const winner = useGameStore((state) => state.winner);
  const players = useGameStore((state) => state.players);
  const resetGame = useGameStore((state) => state.resetGame);
  const setGamePhase = useGameStore((state) => state.setGamePhase);

  const onMenu = () => setGamePhase('setup');
  const onRestart = resetGame;

  if (winner === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
       <div className="bg-[#13132B] p-8 rounded-3xl shadow-[0_0_100px_rgba(121,40,202,0.5)] border border-purple-500/30 max-w-sm w-full text-center transform scale-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <Trophy size={48} fill="currentColor" />
          </div>
          <h2 className="text-4xl font-bold mb-2 text-white tracking-tight">VICTORY</h2>
          <p className="text-lg mb-8 text-indigo-200">
            <span className={`font-bold text-transparent bg-clip-text ${winner === 0 ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}>
              {players[winner].name}
            </span> dominates!
          </p>
            <button 
              onClick={onMenu}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 transition-all active:scale-95 border border-white/10"
            >
              Return to Menu
            </button>
       </div>
    </div>
  );
}
