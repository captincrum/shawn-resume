// Find the Cat — types + engine.
// The engine calls the Netlify function at /.netlify/functions/ftc.
// The browser never receives the solution; it rides inside `token`,
// encrypted server-side, and only comes back at reveal time.

const ENDPOINT = '/.netlify/functions/ftc';

// Difficulty now changes the PUZZLE and the AI's willingness — not the
// question count. `label` is shown in the dropdown.
export const DIFFICULTIES = {
  Easy: { label: 'Lost & Found ' },
  Medium: { label: 'Brain Teaser ' },
  Hard: { label: 'Cold Case' },
  Nightmare: { label: 'Bug Hunt' },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;

export interface Exchange {
  question?: string;
  answer?: string;
  // Guess entries log the player's guess + verdict so they show inline with the chat.
  // No question/answer fields → the server's history/transcript builders skip them.
  guess?: string;
  verdict?: 'right' | 'wrong';
}

export interface Game {
  difficulty: Difficulty;
  intro: string;
  token: string; // encrypted solution; opaque to the browser
  budget: number; // questions allowed
  asked: number; // questions + guesses used
  tokenBudget: number; // total AI tokens allowed
  tokensUsed: number; // real AI tokens consumed so far
  log: Exchange[];
  guesses: string[]; // wrong guesses
  status: 'playing' | 'won' | 'lost';
  lastGuessWrong: boolean;
  code?: string; // Nightmare only — the snippet under review
  language?: string; // Nightmare only — for syntax labelling
  solution?: string; // filled only when the game ends
  explanation?: string; // teaching write-up, from reveal
}

async function post(payload: unknown): Promise<any> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

const usageTotal = (u: any): number => (u && typeof u.total === 'number' ? u.total : 0);

export async function createGame(difficulty: Difficulty): Promise<Game> {
  const d = await post({ action: 'new', difficulty });
  return {
    difficulty: d.difficulty,
    intro: d.intro,
    code: d.code,
    language: d.language,
    token: d.token,
    budget: d.budget,
    asked: 0,
    tokenBudget: d.tokenBudget,
    tokensUsed: usageTotal(d.usage),
    log: [],
    guesses: [],
    status: 'playing',
    lastGuessWrong: false,
  };
}

export async function askGatekeeper(game: Game, question: string): Promise<Game> {
  const d = await post({
    action: 'ask',
    difficulty: game.difficulty,
    token: game.token,
    history: game.log,
    question,
  });
  return {
    ...game,
    asked: game.asked + 1,
    tokensUsed: game.tokensUsed + usageTotal(d.usage),
    log: [...game.log, { question, answer: d.answer }],
    lastGuessWrong: false,
  };
}

// A guess costs a turn. Correct → reveal + win. Wrong → keep playing, flagged.
export async function submitGuess(game: Game, guess: string): Promise<Game> {
  const d = await post({
    action: 'guess',
    difficulty: game.difficulty,
    token: game.token,
    guess,
  });
  const guessEntry: Exchange = { guess, verdict: d.correct ? 'right' : 'wrong' };
  const afterGuess: Game = {
    ...game,
    asked: game.asked + 1,
    tokensUsed: game.tokensUsed + usageTotal(d.usage),
    log: [...game.log, guessEntry],
  };
  if (d.correct) return reveal(afterGuess, true);
  return { ...afterGuess, guesses: [...game.guesses, guess], lastGuessWrong: true };
}

// Reveal the answer + a coaching review. solved=true on a winning guess,
// solved=false when the player gives up and asks to be told.
export async function reveal(game: Game, solved: boolean): Promise<Game> {
  const d = await post({
    action: 'reveal',
    difficulty: game.difficulty,
    token: game.token,
    history: game.log,
    guesses: game.guesses,
    solved,
  });
  return {
    ...game,
    tokensUsed: game.tokensUsed + usageTotal(d.usage),
    status: solved ? 'won' : 'lost',
    solution: d.solution,
    explanation: d.explanation,
  };
}