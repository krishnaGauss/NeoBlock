import { DIRECTIONS } from '../constants/game';

// Helper: Check if a move is blocked by a wall
export const isBlocked = (r1, c1, r2, c2, currentWalls) => {
  if (r2 > r1) return currentWalls.some(w => w.type === 'h' && w.r === r1 && (w.c === c1 || w.c === c1 - 1));
  if (r2 < r1) return currentWalls.some(w => w.type === 'h' && w.r === r2 && (w.c === c1 || w.c === c1 - 1));
  if (c2 > c1) return currentWalls.some(w => w.type === 'v' && w.c === c1 && (w.r === r1 || w.r === r1 - 1));
  if (c2 < c1) return currentWalls.some(w => w.type === 'v' && w.c === c2 && (w.r === r1 || w.r === r1 - 1));
  return false;
};

// Helper: BFS to check if path exists
export const hasPath = (startR, startC, goalRow, currentWalls, boardSize) => {
  const queue = [{ r: startR, c: startC }];
  const visited = new Set([`${startR},${startC}`]);
  while (queue.length > 0) {
    const { r, c } = queue.shift();
    if (r === goalRow) return true;
    for (let d of DIRECTIONS) {
      const nr = r + d.r, nc = c + d.c;
      if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && !visited.has(`${nr},${nc}`) && !isBlocked(r, c, nr, nc, currentWalls)) {
        visited.add(`${nr},${nc}`);
        queue.push({ r: nr, c: nc });
      }
    }
  }
  return false;
};
