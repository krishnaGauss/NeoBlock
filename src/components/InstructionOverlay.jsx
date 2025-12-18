import React from 'react';
import { X, Info } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function InstructionOverlay() {
  const showInstructions = useGameStore((state) => state.showInstructions);
  const dismissInstructions = useGameStore((state) => state.dismissInstructions);

  if (!showInstructions) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
       <div className="bg-[#13132B] p-6 rounded-3xl shadow-[0_0_50px_rgba(121,40,202,0.3)] border border-purple-500/30 max-w-md w-full relative transform scale-100">
          
          <button 
            onClick={dismissInstructions}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Info size={32} />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-white text-center tracking-tight">How to Play</h2>
          
          <ul className="space-y-4 text-indigo-100/90 text-left px-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold mt-0.5">1</span>
              <span>Reach the opposite side of the board to win.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold mt-0.5">2</span>
              <span>Place walls by hovering between the blocks (gaps). You can also change the alignment of walls to be vertical.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold mt-0.5">3</span>
              <span>Manage your wall count wisely, and remember you cannot block a player completely!</span>
            </li>
          </ul>

          <button 
            onClick={dismissInstructions}
            className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/5"
          >
            Got it
          </button>
       </div>
    </div>
  );
}
