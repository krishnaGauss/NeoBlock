import { create } from 'zustand';
import { Smile, Ghost } from 'lucide-react';
import { isBlocked, hasPath } from '../utils/pathfinding';

const useGameStore = create((set, get) => ({
  // App State
  gamePhase: 'setup',
  boardSize: 15,
  maxWalls: 7,

  // Game State
  players: [],
  currentPlayer: 0,
  walls: [],
  wallOrientation: 'h',
  winner: null,
  errorMsg: '',
  hasPlacedWall: false,

  // Actions
  setGamePhase: (phase) => set({ gamePhase: phase }),

  initGame: (size, wallCount) => {
    const centerCol = Math.floor(size / 2);
    set({
      boardSize: size,
      maxWalls: wallCount,
      players: [
        { 
          r: size - 1, 
          c: centerCol, 
          color: 'bg-gradient-to-br from-[#FF0080] to-[#7928CA]', 
          shadow: 'shadow-[0_0_20px_rgba(255,0,128,0.5)]', 
          name: 'Neon', 
          goalRow: 0, 
          walls: wallCount, 
          icon: Smile 
        },
        { 
          r: 0, 
          c: centerCol, 
          color: 'bg-gradient-to-br from-[#00DFD8] to-[#007CF0]', 
          shadow: 'shadow-[0_0_20px_rgba(0,223,216,0.5)]', 
          name: 'Cyber', 
          goalRow: size - 1, 
          walls: wallCount, 
          icon: Ghost 
        }
      ],
      walls: [],
      currentPlayer: 0,
      winner: null,
      errorMsg: '',
      hasPlacedWall: false,
      gamePhase: 'playing'
    });
  },

  resetGame: () => {
    const { initGame, boardSize, maxWalls } = get();
    initGame(boardSize, maxWalls);
  },

  toggleOrientation: () => {
    set((state) => ({ wallOrientation: state.wallOrientation === 'h' ? 'v' : 'h' }));
  },

  movePlayer: (r, c) => {
    const { winner, players, currentPlayer, walls } = get();
    if (winner !== null) return;
    
    const p = players[currentPlayer];
    const opponent = players[1 - currentPlayer];
    const dist = Math.abs(p.r - r) + Math.abs(p.c - c);
    
    if (dist !== 1) return;
    if (opponent.r === r && opponent.c === c) return;
    if (isBlocked(p.r, p.c, r, c, walls)) return;

    const newPlayers = [...players];
    newPlayers[currentPlayer] = { ...p, r, c };
    
    let newWinner = null;
    let nextPlayer = currentPlayer;
    let resetPlacedWall = false;

    if (r === p.goalRow) {
        newWinner = currentPlayer;
    } else {
        nextPlayer = 1 - currentPlayer;
        resetPlacedWall = true;
    }

    set({
      players: newPlayers,
      winner: newWinner,
      currentPlayer: nextPlayer,
      hasPlacedWall: resetPlacedWall ? false : get().hasPlacedWall,
      errorMsg: ''
    });
  },

  placeWall: (r, c) => {
    const { winner, hasPlacedWall, players, currentPlayer, wallOrientation, walls, boardSize } = get();
    
    if (winner !== null) return;
    if (hasPlacedWall) {
      set({ errorMsg: "You can only place 1 wall per turn! Move now." });
      return;
    }
    if (players[currentPlayer].walls <= 0) {
      set({ errorMsg: "Energy Depleted!" });
      return;
    }

    // Validation
    // 1. Boundary Check
    if (wallOrientation === 'h' && c >= boardSize - 1) return;
    if (wallOrientation === 'v' && r >= boardSize - 1) return;

    // 2. Overlap Check
    for (let w of walls) {
      if (w.r === r && w.c === c && w.type === wallOrientation) { set({ errorMsg: "Invalid Placement!" }); return; }
      if (wallOrientation === 'h') { if (w.type === 'h' && w.r === r && Math.abs(w.c - c) <= 1) { set({ errorMsg: "Invalid Placement!" }); return; } } 
      else { if (w.type === 'v' && w.c === c && Math.abs(w.r - r) <= 1) { set({ errorMsg: "Invalid Placement!" }); return; } }
      if (w.r === r && w.c === c && w.type !== wallOrientation) { set({ errorMsg: "Invalid Placement!" }); return; }
    }

    // 3. Pathfinding Check
    const tempWalls = [...walls, { r, c, type: wallOrientation }];
    if (!hasPath(players[0].r, players[0].c, players[0].goalRow, tempWalls, boardSize)) { set({ errorMsg: "Cannot completely block path!" }); return; }
    if (!hasPath(players[1].r, players[1].c, players[1].goalRow, tempWalls, boardSize)) { set({ errorMsg: "Cannot completely block path!" }); return; }

    const newWalls = [...walls, { r, c, type: wallOrientation, id: Date.now() }];
    const newPlayers = [...players];
    newPlayers[currentPlayer].walls -= 1;

    set({
      walls: newWalls,
      players: newPlayers,
      hasPlacedWall: true,
      errorMsg: "Wall placed! Now make your move."
    });
  }
}));

export default useGameStore;
