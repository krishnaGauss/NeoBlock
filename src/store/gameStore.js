import { create } from 'zustand';
import { Smile, Ghost } from 'lucide-react';
import { isBlocked, hasPath } from '../utils/pathfinding';
import { signIn, getCurrentUser } from '../backend/auth';
import { createRoom, joinRoom, subscribeToRoom, updateGame } from '../backend/room';

const useGameStore = create((set, get) => ({
  // App State
  gamePhase: 'setup',  // 'setup' | 'playing' | 'lobby'
  mode: 'local',       // 'local' | 'online'
  
  // Online State
  roomId: null,
  playerId: null,      // Auth UID
  isHost: false,       // true if Player 0
  unsubscribeRoom: null, // Cleanup function for listener

  // Board Config
  boardSize: 15,
  maxWalls: 7,

  // Game State
  players: [],
  currentPlayer: 0,
  walls: [],
  wallOrientation: 'h',
  winner: null,
  statusMsg: '',
  errorMsg: '',
  hasPlacedWall: false,
  showInstructions: false,

  // --- ACTIONS ---

  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  dismissInstructions: () => set({ showInstructions: false }),

  // 1. Local Game Init
  initLocalGame: (size, wallCount) => {
    const centerCol = Math.floor(size / 2);
    set({
      mode: 'local',
      roomId: null,
      playerId: 'local',
      isHost: true, // In local, you control everything
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
      statusMsg: '',
      hasPlacedWall: false,
      gamePhase: 'playing',
      showInstructions: true
    });
  },

  resetGame: () => {
    const { mode, boardSize, maxWalls, roomId } = get();
    if (mode === 'local') {
        get().initLocalGame(boardSize, maxWalls);
    } else {
        // Online reset not fully spec'd, for now maybe just clear board but keep connection?
        // Or re-trigger createRoom? Simplest is to just re-initialize the board state in Firestore.
        // Let's assume reset is a "Play Again" feature. 
        // For MVP, allow Host to reset.
        if (get().isHost) {
             const centerCol = Math.floor(boardSize / 2);
             updateGame(roomId, {
                walls: [],
                currentPlayer: 0,
                winner: null,
                hasPlacedWall: false,
                // Reset players positions
                players: get().players.map((p, idx) => ({
                    ...p,
                    r: idx === 0 ? boardSize - 1 : 0,
                    c: centerCol,
                    walls: maxWalls
                }))
             });
        }
    }
  },

  // 2. Online Actions
  enterLobby: async () => {
     try {
         await signIn(); // Ensure auth
         set({ gamePhase: 'lobby', errorMsg: '' });
     } catch(e) {
         set({ errorMsg: "Auth failed: " + e.message });
     }
  },

  // Helper for transient validation messages
  flashError: (msg) => {
      set({ errorMsg: msg });
      setTimeout(() => {
          if (get().errorMsg === msg) {
              set({ errorMsg: '' });
          }
      }, 4000);
  },

  createOnlineRoom: async (size, wallCount) => {
      try {
          set({ statusMsg: 'Creating room...', errorMsg: '' });
          await signIn(); // Ensure Auth
          const code = await createRoom(size, wallCount);
          const uid = getCurrentUser().uid;
          
          // Subscribe immediately
          const unsub = subscribeToRoom(code, (data) => get().syncRemoteState(data));
          
          set({
              mode: 'online',
              roomId: code,
              playerId: uid,
              isHost: true,
              unsubscribeRoom: unsub,
              boardSize: size,
              maxWalls: wallCount,
              gamePhase: 'lobby', // Waiting for P2
              errorMsg: '',
              statusMsg: ''
          });
      } catch (e) {
          set({ errorMsg: e.message, statusMsg: '' });
      }
  },

  joinOnlineRoom: async (code) => {
      try {
          set({ statusMsg: 'Joining...', errorMsg: '' });
          await signIn(); // Ensure Auth
          await joinRoom(code);
          const uid = getCurrentUser().uid;

          // Subscribe
          const unsub = subscribeToRoom(code, (data) => get().syncRemoteState(data));

          set({
              mode: 'online',
              roomId: code,
              playerId: uid,
              isHost: false, // Guest
              unsubscribeRoom: unsub,
              gamePhase: 'lobby', // Will switch to playing when data syncs
              errorMsg: '',
              statusMsg: ''
          });
      } catch (e) {
          set({ errorMsg: e.message, statusMsg: '' });
      }
  },

  syncRemoteState: (data) => {
      if (!data) return;
      // Parse players from data
      const { players: rawPlayers, walls, currentPlayer, winner, status, boardSize, maxWalls } = data;
      
      if (!rawPlayers) return;

      const enrichedPlayers = rawPlayers.map((p, idx) => ({
          ...p,
          // Re-attach UI constants
          color: idx === 0 ? 'bg-gradient-to-br from-[#FF0080] to-[#7928CA]' : 'bg-gradient-to-br from-[#00DFD8] to-[#007CF0]',
          shadow: idx === 0 ? 'shadow-[0_0_20px_rgba(255,0,128,0.5)]' : 'shadow-[0_0_20px_rgba(0,223,216,0.5)]',
          icon: idx === 0 ? Smile : Ghost
      }));

      const myUid = get().playerId;
      const amIHost = rawPlayers[0]?.uid === myUid;

      // Check if game started
      const newPhase = status === 'playing' ? 'playing' : 'lobby';

      const currentLocalPlayer = get().currentPlayer;
      const turnChanged = currentLocalPlayer !== currentPlayer;

      set({
          boardSize,
          maxWalls,
          players: enrichedPlayers,
          walls,
          currentPlayer,
          winner,
          gamePhase: newPhase,
          isHost: amIHost,
          hasPlacedWall: turnChanged ? false : get().hasPlacedWall,
          // Show instructions only if we just transitioned to playing
          showInstructions: (status === 'playing' && get().gamePhase !== 'playing') ? true : get().showInstructions
      });
  },

  toggleOrientation: () => {
    set((state) => ({ wallOrientation: state.wallOrientation === 'h' ? 'v' : 'h' }));
  },

  // 3. Gameplay Logic
  checkTurn: () => {
      const { mode, currentPlayer, isHost } = get();
      if (mode === 'local') return true;
      const isMyTurn = (currentPlayer === 0 && isHost) || (currentPlayer === 1 && !isHost);
      return isMyTurn;
  },

  // Helper to strip UI properties before sending to Firestore
  sanitizePlayers: (players) => {
      return players.map(({ color, shadow, icon, ...rest }) => rest);
  },

  // State for locking actions during async opts
  isActionInProgress: false,

  // ...

  movePlayer: (r, c) => {
    const { winner, players, currentPlayer, walls, mode, roomId, checkTurn, sanitizePlayers, flashError, isActionInProgress } = get();
    
    if (winner !== null) return;
    if (isActionInProgress) return; // Block concurrent actions
    
    if (!checkTurn()) {
        flashError("Not your turn!");
        return;
    }

    const p = players[currentPlayer];
    const opponent = players[1 - currentPlayer];
    const dist = Math.abs(p.r - r) + Math.abs(p.c - c);
    
    if (dist !== 1) return;
    if (opponent.r === r && opponent.c === c) return;
    if (isBlocked(p.r, p.c, r, c, walls)) return;

    // Logic for next state
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

    // Apply State
    if (mode === 'local') {
        set({
            players: newPlayers,
            winner: newWinner,
            currentPlayer: nextPlayer,
            hasPlacedWall: resetPlacedWall ? false : get().hasPlacedWall,
            errorMsg: ''
        });
    } else {
        // Optimistic Update
        const previousState = {
            players: players,
            winner: winner,
            currentPlayer: currentPlayer,
            hasPlacedWall: get().hasPlacedWall
        };

        set({
            players: newPlayers,
            winner: newWinner,
            currentPlayer: nextPlayer,
            hasPlacedWall: resetPlacedWall ? false : get().hasPlacedWall,
            isActionInProgress: true,
            errorMsg: ''
        });

        updateGame(roomId, {
            players: sanitizePlayers(newPlayers),
            winner: newWinner,
            currentPlayer: nextPlayer
        })
        .then(() => {
             // Success - unlock
             set({ isActionInProgress: false });
        })
        .catch(err => {
            // Revert
            set({
                ...previousState,
                isActionInProgress: false
            });
            flashError("Sync error: " + err.message);
        });
    }
  },

  placeWall: (r, c) => {
    const { winner, hasPlacedWall, players, currentPlayer, wallOrientation, walls, boardSize, mode, roomId, checkTurn, sanitizePlayers, flashError, isActionInProgress } = get();
    
    if (winner !== null) return;
    if (isActionInProgress) return; // Block concurrent actions

    if (!checkTurn()) {
        flashError("Not your turn!");
        return;
    }

    if (hasPlacedWall) {
      flashError("You can only place 1 wall per turn! Move now.");
      return;
    }
    if (players[currentPlayer].walls <= 0) {
      flashError("Energy Depleted!");
      return;
    }

    // Validation
    if (wallOrientation === 'h' && c >= boardSize - 1) return;
    if (wallOrientation === 'v' && r >= boardSize - 1) return;

    for (let w of walls) {
      if (w.r === r && w.c === c && w.type === wallOrientation) { flashError("Invalid Placement!"); return; }
      if (wallOrientation === 'h') { if (w.type === 'h' && w.r === r && Math.abs(w.c - c) <= 1) { flashError("Invalid Placement!"); return; } } 
      else { if (w.type === 'v' && w.c === c && Math.abs(w.r - r) <= 1) { flashError("Invalid Placement!"); return; } }
      if (w.r === r && w.c === c && w.type !== wallOrientation) { flashError("Invalid Placement!"); return; }
    }

    const tempWalls = [...walls, { r, c, type: wallOrientation }];
    if (!hasPath(players[0].r, players[0].c, players[0].goalRow, tempWalls, boardSize)) { flashError("Cannot completely block path!"); return; }
    if (!hasPath(players[1].r, players[1].c, players[1].goalRow, tempWalls, boardSize)) { flashError("Cannot completely block path!"); return; }

    const newWalls = [...walls, { r, c, type: wallOrientation, id: Date.now() }];
    const newPlayers = [...players];
    newPlayers[currentPlayer].walls -= 1;

    if (mode === 'local') {
        set({
            walls: newWalls,
            players: newPlayers,
            hasPlacedWall: true,
            errorMsg: "Wall placed! Now make your move."
        });
        get().flashError("Wall placed! Now make your move.");
    } else {
        // Optimistic Update
        const previousState = {
            walls: walls,
            players: players,
            hasPlacedWall: get().hasPlacedWall
        };

        set({ 
            walls: newWalls,
            players: newPlayers,
            hasPlacedWall: true, 
            isActionInProgress: true,
            errorMsg: "Wall placed! Now make your move." // Immediate feedback
        });
        
        // No need to flash here, the state is set. Maybe flash for emphasis?
        // get().flashError("Wall placed! Now make your move."); 

        updateGame(roomId, {
            walls: newWalls,
            players: sanitizePlayers(newPlayers)
        }).then(() => {
            set({ isActionInProgress: false });
            get().flashError("Wall placed! Now make your move.");
        }).catch(err => {
            // Revert on failure
            set({ 
                ...previousState,
                isActionInProgress: false 
            });
            flashError("Sync error: " + err.message);
        });
    }
  }
}));

export default useGameStore;
