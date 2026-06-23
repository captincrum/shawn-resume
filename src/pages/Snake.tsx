import { useCallback, useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';

const SIZE = 20;     // 20 x 20 grid
const START: Point = { x: 10, y: 10 };

const SPEEDS = {
  Slow: 160,
  Normal: 110,
  Fast: 70,
} as const;
type Speed = keyof typeof SPEEDS;

const OBSTACLE_COUNT = 8;

const DIRS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Dir, Dir> = {
  up: 'down', down: 'up', left: 'right', right: 'left',
};

function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

// finds a free cell not occupied by anything in `blocked`
function randomCell(blocked: Point[]): Point {
  let p: Point;
  do {
    p = {
      x: Math.floor(Math.random() * SIZE),
      y: Math.floor(Math.random() * SIZE),
    };
  } while (blocked.some((b) => samePoint(b, p)));
  return p;
}

function randomObstacles(snake: Point[], food: Point): Point[] {
  const obstacles: Point[] = [];
  for (let i = 0; i < OBSTACLE_COUNT; i++) {
    // keep a clear column around the spawn point so you don't die instantly
    let p: Point;
    do {
      p = randomCell([...snake, food, ...obstacles]);
    } while (Math.abs(p.x - START.x) < 2 && Math.abs(p.y - START.y) < 2);
    obstacles.push(p);
  }
  return obstacles;
}

export function Snake() {
  const [snake, setSnake] = useState<Point[]>([START]);
  const [food, setFood] = useState<Point>(() => randomCell([START]));
  const [obstacles, setObstacles] = useState<Point[]>([]);
  const [dir, setDir] = useState<Dir>('right');
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);

  // settings (locked while a game is running so they can't change mid-play)
  const [speed, setSpeed] = useState<Speed>('Normal');
  const [wrap, setWrap] = useState(false);
  const [useObstacles, setUseObstacles] = useState(false);

  // refs let the game loop read current values without re-subscribing each tick
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const obstaclesRef = useRef(obstacles);
  const dirRef = useRef(dir);
  const queuedRef = useRef<Dir | null>(null);
  const wrapRef = useRef(wrap);
  snakeRef.current = snake;
  foodRef.current = food;
  obstaclesRef.current = obstacles;
  dirRef.current = dir;
  wrapRef.current = wrap;

  const reset = useCallback(() => {
    const s = [START];
    const f = randomCell(s);
    const obs = useObstacles ? randomObstacles(s, f) : [];
    snakeRef.current = s;
    foodRef.current = f;
    obstaclesRef.current = obs;
    dirRef.current = 'right';
    queuedRef.current = null;
    setSnake(s);
    setFood(f);
    setObstacles(obs);
    setDir('right');
    setScore(0);
    setOver(false);
    setRunning(true);
  }, [useObstacles]);

  // keyboard input (arrows + WASD); can't reverse straight into yourself
  useEffect(() => {
    const keymap: Record<string, Dir> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
    };
    function onKey(e: KeyboardEvent) {
      const next = keymap[e.key];
      if (!next) return;
      e.preventDefault();
      if (next !== OPPOSITE[dirRef.current]) queuedRef.current = next;
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // game loop
  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => {
      const queued = queuedRef.current;
      const move =
        queued && queued !== OPPOSITE[dirRef.current] ? queued : dirRef.current;
      queuedRef.current = null;
      dirRef.current = move;
      setDir(move);

      const cur = snakeRef.current;
      const head = { x: cur[0].x + DIRS[move].x, y: cur[0].y + DIRS[move].y };

      if (wrapRef.current) {
        // wrap mode: walls become portals
        head.x = (head.x + SIZE) % SIZE;
        head.y = (head.y + SIZE) % SIZE;
      } else if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) {
        setOver(true);
        setRunning(false);
        return;
      }

      const hitSelf = cur.some((s) => samePoint(s, head));
      const hitObstacle = obstaclesRef.current.some((o) => samePoint(o, head));
      if (hitSelf || hitObstacle) {
        setOver(true);
        setRunning(false);
        return;
      }

      const ate = samePoint(head, foodRef.current);
      const next = ate ? [head, ...cur] : [head, ...cur.slice(0, -1)];
      snakeRef.current = next;
      setSnake(next);

      if (ate) {
        setScore((sc) => sc + 1);
        // new food can't land on the snake or an obstacle
        const nf = randomCell([...next, ...obstaclesRef.current]);
        foodRef.current = nf;
        setFood(nf);
      }
    }, SPEEDS[speed]);
    return () => clearInterval(id);
  }, [running, over, speed]);

  return (
    <main className="content game">
      <div className="section__head">
        <span className="section__index">★</span>
        <h2 className="section__title">Snake</h2>
      </div>

      <div className="game__bar">
        <span className="game__score">Score: {score}</span>
        <button type="button" className="game__btn" onClick={reset}>
          {over ? 'Play again' : running ? 'Restart' : 'Start'}
        </button>
      </div>

      <div className="game__settings">
        <label className="game__setting">
          <span>Speed</span>
          <select
            value={speed}
            disabled={running}
            onChange={(e) => setSpeed(e.target.value as Speed)}
          >
            {Object.keys(SPEEDS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="game__setting game__setting--check">
          <input
            type="checkbox"
            checked={wrap}
            disabled={running}
            onChange={(e) => setWrap(e.target.checked)}
          />
          <span>Wrap-around</span>
        </label>

        <label className="game__setting game__setting--check">
          <input
            type="checkbox"
            checked={useObstacles}
            disabled={running}
            onChange={(e) => setUseObstacles(e.target.checked)}
          />
          <span>Obstacles</span>
        </label>
      </div>

      <div
        className="snake-board"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          const isObstacle = obstacles.some((o) => o.x === x && o.y === y);
          const cls = isHead
            ? 'snake-cell snake-cell--head'
            : isBody
            ? 'snake-cell snake-cell--body'
            : isFood
            ? 'snake-cell snake-cell--food'
            : isObstacle
            ? 'snake-cell snake-cell--obstacle'
            : 'snake-cell';
          return <div key={i} className={cls} />;
        })}
      </div>

      {over && <p className="game__msg">Game over — you scored {score}.</p>}
      <p className="game__hint">Arrow keys or WASD to move.</p>
    </main>
  );
}