import { useCallback, useMemo, useState } from 'react';

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

const SIZES = {
  Small: 9,
  Medium: 12,
  Large: 16,
  'Extra Large': 22,
} as const;
type SizeName = keyof typeof SIZES;

// mine density as a fraction of total cells
const DENSITY = {
  Easy: 0.12,
  Medium: 0.16,
  Hard: 0.21,
} as const;
type Difficulty = keyof typeof DENSITY;

function mineCountFor(size: number, difficulty: Difficulty): number {
  return Math.round(size * size * DENSITY[difficulty]);
}

function emptyBoard(size: number): Cell[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

const NEIGHBORS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

// place mines AFTER first click, keeping the clicked cell (and its neighbors) clear
function placeMines(
  board: Cell[][],
  size: number,
  mines: number,
  safeR: number,
  safeC: number
): Cell[][] {
  const next = board.map((row) => row.map((c) => ({ ...c })));
  const forbidden = new Set<string>();
  forbidden.add(`${safeR},${safeC}`);
  for (const [dr, dc] of NEIGHBORS) {
    forbidden.add(`${safeR + dr},${safeC + dc}`);
  }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (next[r][c].mine || forbidden.has(`${r},${c}`)) continue;
    next[r][c].mine = true;
    placed++;
  }

  // compute adjacency counts
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (next[r][c].mine) continue;
      let count = 0;
      for (const [dr, dc] of NEIGHBORS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && next[nr][nc].mine) {
          count++;
        }
      }
      next[r][c].adjacent = count;
    }
  }
  return next;
}

// flood-fill: reveal the clicked cell, and if it's empty, cascade to neighbors
function revealFrom(board: Cell[][], size: number, r: number, c: number): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[r, c]];

  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = next[cr][cc];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) {
      for (const [dr, dc] of NEIGHBORS) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !next[nr][nc].revealed) {
          stack.push([nr, nc]);
        }
      }
    }
  }
  return next;
}

export function Minesweeper() {
  const [sizeName, setSizeName] = useState<SizeName>('Medium');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const size = SIZES[sizeName];
  const mines = useMemo(() => mineCountFor(size, difficulty), [size, difficulty]);

  const [board, setBoard] = useState<Cell[][]>(() => emptyBoard(size));
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);

  const flagsUsed = board.flat().filter((c) => c.flagged).length;

  const reset = useCallback(() => {
    setBoard(emptyBoard(size));
    setStarted(false);
    setOver(false);
    setWon(false);
  }, [size]);

  // changing size/difficulty resets to a fresh board of the new dimensions
  const changeSize = (name: SizeName) => {
    setSizeName(name);
    setBoard(emptyBoard(SIZES[name]));
    setStarted(false);
    setOver(false);
    setWon(false);
  };
  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    reset();
  };

  function checkWin(b: Cell[][]): boolean {
    // win = every non-mine cell is revealed
    for (const row of b) {
      for (const cell of row) {
        if (!cell.mine && !cell.revealed) return false;
      }
    }
    return true;
  }

  function revealAllMines(b: Cell[][]): Cell[][] {
    return b.map((row) =>
      row.map((c) => (c.mine ? { ...c, revealed: true } : c))
    );
  }

  const handleClick = (r: number, c: number) => {
    if (over) return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;

    let working = board;

    // first click: generate the mines now, guaranteeing this cell is safe
    if (!started) {
      working = placeMines(board, size, mines, r, c);
      setStarted(true);
    }

    if (working[r][c].mine) {
      setBoard(revealAllMines(working));
      setOver(true);
      setWon(false);
      return;
    }

    const revealed = revealFrom(working, size, r, c);
    if (checkWin(revealed)) {
      setBoard(revealed);
      setOver(true);
      setWon(true);
    } else {
      setBoard(revealed);
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (over || !started) return;
    const cell = board[r][c];
    if (cell.revealed) return;
    const next = board.map((row) => row.map((cc) => ({ ...cc })));
    next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
  };

  return (
    <main className="content game">
      <div className="section__head">
        <span className="section__index">★</span>
        <h2 className="section__title">Minesweeper</h2>
      </div>

      <div className="game__bar">
        <span className="game__score">
          Mines: {mines - flagsUsed}
        </span>
        <button type="button" className="game__btn" onClick={reset}>
          {over ? 'Play again' : started ? 'Restart' : 'Reset'}
        </button>
      </div>

      <div className="game__settings">
        <label className="game__setting">
          <span>Size</span>
          <select
            value={sizeName}
            disabled={started && !over}
            onChange={(e) => changeSize(e.target.value as SizeName)}
          >
            {Object.keys(SIZES).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="game__setting">
          <span>Difficulty</span>
          <select
            value={difficulty}
            disabled={started && !over}
            onChange={(e) => changeDifficulty(e.target.value as Difficulty)}
          >
            {Object.keys(DENSITY).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <span className="game__setting">
          <span>{mines} mines</span>
        </span>
      </div>

      <div
        className="mine-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const classes = ['mine-cell'];
            if (cell.revealed) {
              classes.push('mine-cell--revealed');
              if (cell.mine) classes.push('mine-cell--mine');
            }
            if (cell.adjacent > 0 && cell.revealed && !cell.mine) {
              classes.push(`mine-cell--n${cell.adjacent}`);
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={classes.join(' ')}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                aria-label={`cell ${r},${c}`}
              >
                {cell.revealed
                  ? cell.mine
                    ? '⬡'
                    : cell.adjacent > 0
                    ? cell.adjacent
                    : ''
                  : cell.flagged
                  ? '⚑'
                  : ''}
              </button>
            );
          })
        )}
      </div>

      {over && (
        <p className="game__msg">
          {won ? 'Cleared it — nicely done.' : 'Boom. Try again.'}
        </p>
      )}
      <p className="game__hint">Left-click to reveal · Right-click to flag.</p>
    </main>
  );
}