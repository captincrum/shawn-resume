import { useState } from 'react';

const COLS = 7;
const ROWS = 6;

type Disc = 0 | 1 | 2; // 0 empty · 1 player one (green) · 2 player two / AI (amber)
type Board = Disc[][]; // [row][col], row 0 = top

const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
] as const;

// center-out column order — better alpha-beta pruning
const ORDER = [3, 2, 4, 1, 5, 0, 6];

const DEPTH = { Easy: 2, Medium: 4, Hard: 6 } as const;
type Difficulty = keyof typeof DEPTH;
type Opponent = 'ai' | 'human';

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => 0 as Disc)
  );
}

function lowestEmptyRow(b: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) if (b[r][col] === 0) return r;
  return -1;
}

function validColumns(b: Board): number[] {
  return ORDER.filter((c) => b[0][c] === 0);
}

function applyMove(b: Board, col: number, disc: Disc): { board: Board; row: number } | null {
  const row = lowestEmptyRow(b, col);
  if (row < 0) return null;
  const board = b.map((r) => r.slice());
  board[row][col] = disc;
  return { board, row };
}

function isWin(b: Board, r: number, c: number, disc: Disc): boolean {
  for (const [dr, dc] of DIRS) {
    let count = 1;
    for (let s = 1; s < 4; s++) {
      const nr = r + dr * s;
      const nc = c + dc * s;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== disc) break;
      count++;
    }
    for (let s = 1; s < 4; s++) {
      const nr = r - dr * s;
      const nc = c - dc * s;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== disc) break;
      count++;
    }
    if (count >= 4) return true;
  }
  return false;
}

// like isWin but returns the actual winning cells, for highlighting
function winningLine(b: Board, r: number, c: number, disc: Disc): [number, number][] | null {
  for (const [dr, dc] of DIRS) {
    const cells: [number, number][] = [[r, c]];
    for (let s = 1; s < 4; s++) {
      const nr = r + dr * s;
      const nc = c + dc * s;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== disc) break;
      cells.push([nr, nc]);
    }
    for (let s = 1; s < 4; s++) {
      const nr = r - dr * s;
      const nc = c - dc * s;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || b[nr][nc] !== disc) break;
      cells.push([nr, nc]);
    }
    if (cells.length >= 4) return cells;
  }
  return null;
}

function scoreWindow(w: Disc[], ai: Disc, human: Disc): number {
  let a = 0;
  let h = 0;
  let e = 0;
  for (const x of w) x === ai ? a++ : x === human ? h++ : e++;
  if (a === 4) return 100;
  if (a === 3 && e === 1) return 8;
  if (a === 2 && e === 2) return 3;
  if (h === 3 && e === 1) return -6;
  if (h === 2 && e === 2) return -2;
  return 0;
}

function evaluate(b: Board, ai: Disc, human: Disc): number {
  let score = 0;
  for (let r = 0; r < ROWS; r++) if (b[r][3] === ai) score += 3; // center bias
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow([b[r][c], b[r][c + 1], b[r][c + 2], b[r][c + 3]], ai, human);
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r <= ROWS - 4; r++)
      score += scoreWindow([b[r][c], b[r + 1][c], b[r + 2][c], b[r + 3][c]], ai, human);
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow(
        [b[r][c], b[r + 1][c + 1], b[r + 2][c + 2], b[r + 3][c + 3]],
        ai,
        human
      );
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++)
      score += scoreWindow(
        [b[r][c], b[r - 1][c + 1], b[r - 2][c + 2], b[r - 3][c + 3]],
        ai,
        human
      );
  return score;
}

function minimax(
  b: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  ai: Disc,
  human: Disc
): number {
  const valid = validColumns(b);
  if (valid.length === 0) return 0; // draw
  if (depth === 0) return evaluate(b, ai, human);

  if (maximizing) {
    let value = -Infinity;
    for (const col of valid) {
      const m = applyMove(b, col, ai)!;
      const score = isWin(m.board, m.row, col, ai)
        ? 1_000_000 + depth
        : minimax(m.board, depth - 1, alpha, beta, false, ai, human);
      value = Math.max(value, score);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  }
  let value = Infinity;
  for (const col of valid) {
    const m = applyMove(b, col, human)!;
    const score = isWin(m.board, m.row, col, human)
      ? -1_000_000 - depth
      : minimax(m.board, depth - 1, alpha, beta, true, ai, human);
    value = Math.min(value, score);
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return value;
}

function bestMove(b: Board, depth: number, ai: Disc, human: Disc): number {
  const valid = validColumns(b);
  let best = valid[0];
  let bestScore = -Infinity;
  for (const col of valid) {
    const m = applyMove(b, col, ai)!;
    const score = isWin(m.board, m.row, col, ai)
      ? 1_000_000
      : minimax(m.board, depth - 1, -Infinity, Infinity, false, ai, human);
    if (score > bestScore) {
      bestScore = score;
      best = col;
    }
  }
  return best;
}

export function Connect4() {
  const [opponent, setOpponent] = useState<Opponent>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Disc>(1);
  const [status, setStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winner, setWinner] = useState<Disc>(0);
  const [winCells, setWinCells] = useState<Set<string>>(new Set());
  const [thinking, setThinking] = useState(false);

  const started = board.some((row) => row.some((c) => c !== 0));

  function reset() {
    setBoard(emptyBoard());
    setTurn(1);
    setStatus('playing');
    setWinner(0);
    setWinCells(new Set());
    setThinking(false);
  }

  function finish(b: Board, w: Disc, cells: [number, number][]) {
    setBoard(b);
    setWinner(w);
    setWinCells(new Set(cells.map(([r, c]) => `${r},${c}`)));
    setStatus('won');
  }

  function aiTurn(b: Board) {
    const col = bestMove(b, DEPTH[difficulty], 2, 1);
    const m = applyMove(b, col, 2)!;
    setThinking(false);
    const line = winningLine(m.board, m.row, col, 2);
    if (line) return finish(m.board, 2, line);
    if (validColumns(m.board).length === 0) {
      setBoard(m.board);
      setStatus('draw');
      return;
    }
    setBoard(m.board);
    setTurn(1);
  }

  function drop(col: number) {
    if (status !== 'playing' || thinking) return;
    if (opponent === 'ai' && turn !== 1) return;
    const m = applyMove(board, col, turn);
    if (!m) return;

    const line = winningLine(m.board, m.row, col, turn);
    if (line) return finish(m.board, turn, line);
    if (validColumns(m.board).length === 0) {
      setBoard(m.board);
      setStatus('draw');
      return;
    }

    const next: Disc = turn === 1 ? 2 : 1;
    setBoard(m.board);
    setTurn(next);
    if (opponent === 'ai' && next === 2) {
      setThinking(true);
      setTimeout(() => aiTurn(m.board), 350);
    }
  }

  const statusText = (() => {
    if (status === 'won') {
      if (opponent === 'ai') return winner === 1 ? 'You win!' : 'The AI wins.';
      return `Player ${winner} wins!`;
    }
    if (status === 'draw') return 'Draw — board full.';
    if (opponent === 'ai') return turn === 1 ? 'Your move' : 'AI is thinking…';
    return turn === 1 ? "Player 1's move" : "Player 2's move";
  })();

  const locked = started && status === 'playing';
  const colsFull = validColumns(board);

  return (
    <main className="content game">
      <div className="section__head">
        <span className="section__index">★</span>
        <h2 className="section__title">Connect 4</h2>
      </div>

      <div className="game__bar">
        <span className="game__score">{statusText}</span>
        <button type="button" className="game__btn" onClick={reset}>
          {status !== 'playing' ? 'Play again' : started ? 'Restart' : 'Reset'}
        </button>
      </div>

      <div className="game__settings">
        <label className="game__setting">
          <span>Opponent</span>
          <select
            value={opponent}
            disabled={locked}
            onChange={(e) => {
              setOpponent(e.target.value as Opponent);
              reset();
            }}
          >
            <option value="ai">vs Computer</option>
            <option value="human">2 Players</option>
          </select>
        </label>

        {opponent === 'ai' && (
          <label className="game__setting">
            <span>Difficulty</span>
            <select
              value={difficulty}
              disabled={locked}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty);
                reset();
              }}
            >
              {Object.keys(DEPTH).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="c4-board">
        {Array.from({ length: COLS }).map((_, col) => {
          const full = !colsFull.includes(col);
          const disabled =
            status !== 'playing' ||
            thinking ||
            full ||
            (opponent === 'ai' && turn !== 1);
          return (
            <button
              key={col}
              type="button"
              className="c4-col"
              onClick={() => drop(col)}
              disabled={disabled}
              aria-label={`Drop in column ${col + 1}`}
            >
              {Array.from({ length: ROWS }).map((__, row) => {
                const disc = board[row][col];
                const win = winCells.has(`${row},${col}`);
                return (
                  <span className="c4-slot" key={row}>
                    {disc !== 0 && (
                      <span
                        key={disc}
                        className={`c4-disc c4-disc--p${disc}${win ? ' c4-disc--win' : ''}`}
                      />
                    )}
                  </span>
                );
              })}
            </button>
          );
        })}
      </div>

      <div className="c4-legend">
        <span>
          <i style={{ background: 'var(--c4-p1)' }} />
          {opponent === 'ai' ? 'You' : 'Player 1'}
        </span>
        <span>
          <i style={{ background: 'var(--c4-p2)' }} />
          {opponent === 'ai' ? 'Computer' : 'Player 2'}
        </span>
      </div>

      <p className="game__hint">
        Click a column to drop. Four in a row — across, down, or diagonal — wins.
      </p>
    </main>
  );
}