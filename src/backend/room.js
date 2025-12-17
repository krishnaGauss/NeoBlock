import { doc, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db, APP_ID } from "./firebase";
import { getCurrentUser } from "./auth";

const COLLECTION_PATH = `artifacts/${APP_ID}/public/data/rooms`;

// Generate a random 6-character room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createRoom = async (boardSize, maxWalls) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const roomCode = generateRoomCode();
  const roomRef = doc(db, COLLECTION_PATH, roomCode);

  const initialData = {
    createdAt: serverTimestamp(),
    boardSize,
    maxWalls,
    players: [{
      uid: user.uid,
      name: "Host", // Placeholder, could fetch real name
      joined: true,
      // Initial Player State
      r: boardSize - 1,
      c: Math.floor(boardSize / 2),
      walls: maxWalls,
      goalRow: 0
    }],
    walls: [],
    currentPlayer: 0,
    winner: null,
    status: 'waiting' // 'waiting', 'playing'
  };

  await setDoc(roomRef, initialData);
  return roomCode;
};

export const joinRoom = async (roomCode) => {
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const roomRef = doc(db, COLLECTION_PATH, roomCode);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error("Room not found");
  }

  const data = roomSnap.data();
  if (data.players.length >= 2) {
    // Check if I am already in the room (re-join)
    if (data.players.some(p => p.uid === user.uid)) {
        return roomCode;
    }
    throw new Error("Room is full");
  }

  // Add Guest Player
  const newPlayer = {
    uid: user.uid,
    name: "Guest",
    joined: true,
    // Initial Player State (P2)
    r: 0,
    c: Math.floor(data.boardSize / 2),
    walls: data.maxWalls,
    goalRow: data.boardSize - 1
  };

  await updateDoc(roomRef, {
    players: arrayUnion(newPlayer),
    status: 'playing' // Start game when 2nd player joins
  });

  return roomCode;
};

export const subscribeToRoom = (roomCode, onUpdate) => {
  const roomRef = doc(db, COLLECTION_PATH, roomCode);
  
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      onUpdate(doc.data());
    } else {
      console.warn("Room document deleted or unavailable.");
    }
  });
};

export const updateGame = async (roomCode, updates) => {
  const roomRef = doc(db, COLLECTION_PATH, roomCode);
  await updateDoc(roomRef, updates);
};
