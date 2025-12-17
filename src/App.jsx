import React from 'react';

import useGameStore from './store/gameStore';

import SetupScreen from './components/SetupScreen';
import WinnerOverlay from './components/WinnerOverlay';
import Sidebar from './components/Sidebar';
import GameBoard from './components/GameBoard';

export default function App() {
  const gamePhase = useGameStore((state) => state.gamePhase);

  // --- RENDER ---
  if (gamePhase === 'setup') {
    return <SetupScreen />;
  }

  return (
    <div className="h-screen w-screen bg-[#0B0B15] text-indigo-100 font-sans flex flex-col md:flex-row overflow-hidden selection:bg-purple-500/30">
      
      {/* Styles & Animations */}
      <style>{`
        @keyframes slam {
          0% { transform: scale(1.5) translateZ(0) translateY(-50px); opacity: 0; filter: blur(4px); }
          60% { transform: scale(1.0) translateZ(0) translateY(0px); opacity: 1; filter: blur(0); }
          80% { transform: scale(1.05) translateZ(0) translateY(-2px); }
          100% { transform: scale(1) translateZ(0) translateY(0); }
        }
        .animate-slam { animation: slam 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .jelly { animation: jelly 0.6s both; }
        @keyframes jelly {
          0% { transform: scale3d(1, 1, 1); }
          30% { transform: scale3d(1.25, 0.75, 1); }
          40% { transform: scale3d(0.75, 1.25, 1); }
          50% { transform: scale3d(1.15, 0.85, 1); }
          65% { transform: scale3d(0.95, 1.05, 1); }
          75% { transform: scale3d(1.05, 0.95, 1); }
          100% { transform: scale3d(1, 1, 1); }
        }
      `}</style>
      
      <WinnerOverlay />

      <Sidebar />

      <GameBoard />
    </div>
  );
}