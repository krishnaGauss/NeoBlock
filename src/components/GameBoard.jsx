import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, Smile, Ghost } from 'lucide-react';
import { isBlocked } from '../utils/pathfinding';
import useGameStore from '../store/gameStore';

export default function GameBoard() {
  const boardSize = useGameStore((state) => state.boardSize);
  const players = useGameStore((state) => state.players);
  const currentPlayer = useGameStore((state) => state.currentPlayer);
  const walls = useGameStore((state) => state.walls);
  const wallOrientation = useGameStore((state) => state.wallOrientation);
  const winner = useGameStore((state) => state.winner);
  const errorMsg = useGameStore((state) => state.errorMsg);
  const mode = useGameStore((state) => state.mode);
  const isHost = useGameStore((state) => state.isHost);
  
  const movePlayer = useGameStore((state) => state.movePlayer);
  const placeWall = useGameStore((state) => state.placeWall);
  const toggleOrientation = useGameStore((state) => state.toggleOrientation);
  const containerRef = useRef(null);
  const [boardSizePx, setBoardSizePx] = useState(0);

  // Resize Observer
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const size = Math.min(width, height) * 0.95;
        setBoardSizePx(size);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative flex items-center justify-center bg-[#0B0B15] overflow-hidden"
    >
       {/* Background Grid Decoration */}
       <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}>
       </div>
       <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0B0B15] via-transparent to-transparent pointer-events-none"></div>

       {/* Mobile Orientation Toggle (Floating) */}
       <div className="md:hidden absolute bottom-6 right-6 z-30 flex gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); toggleOrientation(); }}
            className="w-14 h-14 bg-purple-600 rounded-full text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center active:scale-90 transition-transform border border-white/20"
          >
            <RotateCw size={24} className={wallOrientation === 'v' ? 'rotate-90' : ''} />
          </button>
       </div>

       {/* Mobile Error Toast */}
       {errorMsg && (
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-30 animate-in slide-in-from-top-4 border border-white/20">
            {errorMsg}
          </div>
       )}

       {/* Board Grid */}
       <div 
          className="relative z-10 transition-all duration-300"
          style={{
            width: boardSizePx, 
            height: boardSizePx,
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gap: '2px',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(0,0,0,0.5)'
          }}
          onContextMenu={(e) => { e.preventDefault(); toggleOrientation(); }}
       >
          {Array.from({ length: boardSize }).map((_, r) => (
            <React.Fragment key={r}>
              {Array.from({ length: boardSize }).map((_, c) => {
                const isP1 = players[0].r === r && players[0].c === c;
                const isP2 = players[1].r === r && players[1].c === c;
                const p = players[currentPlayer];
                const dist = Math.abs(p.r - r) + Math.abs(p.c - c);
                const isNeighbor = dist === 1;
                const isOccupied = (players[0].r === r && players[0].c === c) || (players[1].r === r && players[1].c === c);
                const blocked = isNeighbor ? isBlocked(p.r, p.c, r, c, walls) : true;
                
                const isMyTurn = mode === 'local' || (currentPlayer === 0 && isHost) || (currentPlayer === 1 && !isHost);
                const isValidMove = winner === null && isNeighbor && !isOccupied && !blocked && isMyTurn;

                // Styling goals
                const isP1Goal = r === 0;
                const isP2Goal = r === boardSize - 1;

                return (
                  <div key={`${r}-${c}`} className="relative">
                    {/* Cell */}
                    <div 
                      onClick={() => isValidMove && movePlayer(r, c)}
                      className={`
                        w-full h-full rounded-sm md:rounded transition-all duration-300 relative
                        flex items-center justify-center
                        ${isP1Goal ? 'bg-pink-900/20 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]' : ''}
                        ${isP2Goal ? 'bg-cyan-900/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' : ''}
                        ${!isP1Goal && !isP2Goal ? 'bg-[#181828]' : ''}
                        ${isValidMove ? 'cursor-pointer bg-[#2A2A4A] ring-1 ring-inset ring-purple-500/50 z-10' : ''}
                      `}
                    >
                       {!isP1 && !isP2 && !isValidMove && (
                         <div className="w-0.5 h-0.5 bg-white/10 rounded-full"></div>
                       )}

                       {isValidMove && !isP1 && !isP2 && (
                         <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7] animate-pulse"></div>
                       )}

                       {isP1 && (
                          <div className={`w-[75%] h-[75%] rounded-full ${players[0].color} ${players[0].shadow} flex items-center justify-center text-white jelly z-20`}>
                             <Smile size="60%" strokeWidth={2.5} />
                          </div>
                       )}
                       {isP2 && (
                          <div className={`w-[75%] h-[75%] rounded-full ${players[1].color} ${players[1].shadow} flex items-center justify-center text-white jelly z-20`}>
                             <Ghost size="60%" strokeWidth={2.5} />
                          </div>
                       )}
                    </div>

                    {/* Vertical Wall Slot */}
                    {c < boardSize - 1 && r < boardSize - 1 && (
                       <div 
                         className="absolute top-0 right-[-4px] md:right-[-6px] h-full w-[8px] md:w-[12px] z-30 flex flex-col justify-center items-center cursor-pointer group"
                         style={{ height: '100%', top: 0 }} 
                         onClick={() => placeWall(r, c)}
                       >
                          {/* Hover Preview V */}
                          {r < boardSize - 1 && (
                            <div className={`
                              absolute top-0 w-1.5 md:w-2 h-[208%] rounded-full bg-white/10 transition-opacity pointer-events-none
                              ${wallOrientation === 'v' && winner === null && players[currentPlayer].walls > 0 ? 'opacity-0 group-hover:opacity-100' : 'hidden'}
                            `} />
                          )}
                          
                          {/* Actual Vertical Wall */}
                          {walls.map(w => {
                            if (w.type === 'v' && w.r === r && w.c === c) {
                              return (
                                <div key={w.id} className="absolute top-0 w-1.5 md:w-2 h-[208%] bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.6)] pointer-events-none animate-slam z-40">
                                   <div className="absolute top-1 left-[20%] w-[60%] h-[30%] bg-white/60 rounded-full blur-[1px]"></div>
                                </div>
                              );
                            }
                            return null;
                          })}
                       </div>
                    )}

                    {/* Horizontal Wall Slot */}
                    {r < boardSize - 1 && c < boardSize - 1 && (
                       <div 
                         className="absolute bottom-[-4px] md:bottom-[-6px] left-0 w-full h-[8px] md:h-[12px] z-30 flex items-center justify-center cursor-pointer group"
                         onClick={() => placeWall(r, c)}
                       >
                          {/* Hover Preview H */}
                          {c < boardSize - 1 && (
                            <div className={`
                              absolute left-0 h-1.5 md:h-2 w-[208%] rounded-full bg-white/10 transition-opacity pointer-events-none
                              ${wallOrientation === 'h' && winner === null && players[currentPlayer].walls > 0 ? 'opacity-0 group-hover:opacity-100' : 'hidden'}
                            `} />
                          )}

                          {/* Actual Horizontal Wall */}
                          {walls.map(w => {
                            if (w.type === 'h' && w.r === r && w.c === c) {
                              return (
                                <div key={w.id} className="absolute left-0 h-1.5 md:h-2 w-[208%] bg-gradient-to-r from-yellow-300 to-orange-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.6)] pointer-events-none animate-slam z-40">
                                   <div className="absolute top-[20%] left-1 h-[60%] w-[30%] bg-white/60 rounded-full blur-[1px]"></div>
                                </div>
                              );
                            }
                            return null;
                          })}
                       </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
       </div>
    </div>
  );
}
