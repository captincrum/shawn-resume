import { useState } from 'react';
import {
  DIFFICULTIES,
  createGame,
  askGatekeeper,
  submitGuess,
  reveal,
  type Difficulty,
  type Game,
} from './findTheCat.data';

const MAX_QUESTION_LEN = 300;

// Rough client-side estimate only — there's no exact tokenizer in the browser.
// ~4 chars per token is the usual heuristic.
const estChars = (s: string) => Math.ceil(s.length / 4);

// A full ask turn costs more than the typed question: the system prompt and
// running history are re-sent every turn, and the model's reply is billed too.
// These are deliberately rough — enough to keep the displayed estimate honest.
const SYSTEM_PROMPT_EST = 220; // gatekeeper/interviewer system prompt
const ANSWER_EST = 140; // model reply, capped server-side at 160

function estTurnCost(question: string, log: { question: string; answer: string }[]) {
  const history = log.reduce(
    (sum, x) => sum + estChars(x.question) + estChars(x.answer),
    0
  );
  return SYSTEM_PROMPT_EST + history + estChars(question) + ANSWER_EST;
}

export function FindTheCat() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [game, setGame] = useState<Game | null>(null);
  const [question, setQuestion] = useState('');
  const [guess, setGuess] = useState('');
  const [guessing, setGuessing] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState('');

  const playing = game?.status === 'playing';
  const remaining = game ? Math.max(0, game.budget - game.asked) : 0;
  const tokensLeft = game ? game.tokenBudget - game.tokensUsed : 0;
  const canAsk = Boolean(playing) && remaining > 0 && tokensLeft > 0;

  async function run(fn: () => Promise<Game>) {
    setThinking(true);
    setError('');
    try {
      setGame(await fn());
    } catch (e: any) {
      setError(e?.message || 'Something went wrong talking to the gatekeeper.');
    } finally {
      setThinking(false);
    }
  }

  async function start() {
    setQuestion('');
    setGuess('');
    setGuessing(false);
    await run(() => createGame(difficulty));
  }

  async function ask() {
    if (!game || !canAsk || thinking) return;
    const q = question.trim();
    if (!q) return;
    setQuestion('');
    await run(() => askGatekeeper(game, q));
  }

  async function sendGuess() {
    if (!game || !playing || thinking) return;
    const value = guess.trim();
    if (!value) return;
    setGuess('');
    setGuessing(false);
    await run(() => submitGuess(game, value));
  }

  async function getAnswer() {
    if (!game || !playing || thinking) return;
    await run(() => reveal(game, false));
  }

  return (
    <main className="content game">
      <div className="section__head">
        <span className="section__index">★</span>
        <h2 className="section__title">Find the Cat</h2>
      </div>

      {/* ---------- Pre-game ---------- */}
      {!game && (
        <>
          <p className="hero__summary" style={{ margin: 16 }}>
            You're handed a situation with the answer buried in it — some details
            matter, some are noise — and an AI gatekeeper who won't just tell you.
            Ask sharp questions, mind your token budget, then make your call.
          </p>

          <div className="game__settings">
            <label className="game__setting">
              <span>Difficulty</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                {Object.entries(DIFFICULTIES).map(([name, cfg]) => (
                  <option key={name} value={name}>
                    {name} · {cfg.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="game__bar">
            <span className="game__score">Ready when you are</span>
            <button type="button" className="game__btn" onClick={start} disabled={thinking}>
              {thinking ? 'Dealing you in…' : 'Start'}
            </button>
          </div>
          {error && <p className="ftc-error">{error}</p>}
        </>
      )}

      {/* ---------- In progress / ended ---------- */}
      {game && (
        <>
          <div className="game__bar">
            <span className="game__score">
              {playing
                ? `Q ${remaining}/${game.budget} · ${game.tokensUsed.toLocaleString()}/${game.tokenBudget.toLocaleString()} tok`
                : game.status === 'won'
                ? 'Solved it.'
                : 'Game over.'}
            </span>
            <button type="button" className="game__btn" onClick={() => setGame(null)}>
              {playing ? 'Quit' : 'Play again'}
            </button>
          </div>

          <p className="ftc-intro">{game.intro}</p>

          {game.code && (
            <pre className="ftc-code">
              <code>{game.code}</code>
            </pre>
          )}

          {game.log.length > 0 && (
            <div className="ftc-log">
              {game.log.map((x, i) => (
                <div className="ftc-exchange" key={i}>
                  <p className="ftc-q">{x.question}</p>
                  <p className="ftc-a">{x.answer}</p>
                </div>
              ))}
            </div>
          )}

          {thinking && <p className="ftc-thinking">…thinking</p>}
          {error && <p className="ftc-error">{error}</p>}

          {playing && game.lastGuessWrong && (
            <p className="ftc-retry">
              Not quite — that guess cost you a turn. Ask more, try another guess, or get the answer.
            </p>
          )}

          {!playing && (
            <div className={`ftc-result ftc-result--${game.status === 'won' ? 'win' : 'lose'}`}>
              <p className="ftc-result__verdict">
                {game.status === 'won' ? 'Correct — you uncovered it.' : 'Here’s the answer.'}
              </p>
              {game.solution && <p className="ftc-result__solution">{game.solution}</p>}
              {game.explanation && <p className="ftc-result__solution">{game.explanation}</p>}
            </div>
          )}

          {playing && !guessing && (
            <>
              <div className="ftc-row">
                <input
                  className="ftc-input"
                  type="text"
                  placeholder={canAsk ? 'Ask a question…' : 'Out of questions or tokens — make your guess'}
                  value={question}
                  maxLength={MAX_QUESTION_LEN}
                  disabled={thinking || !canAsk}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask()}
                />
                <button
                  type="button"
                  className="game__btn"
                  onClick={ask}
                  disabled={thinking || !canAsk || !question.trim()}
                >
                  Ask
                </button>
                <button
                  type="button"
                  className="game__btn"
                  onClick={() => setGuessing(true)}
                  disabled={thinking}
                >
                  Make a guess
                </button>
              </div>
              <p className="game__hint" style={{ margin: '0 0 0.85rem', textAlign: 'right' }}>
                {question.length}/{MAX_QUESTION_LEN} · ~{estTurnCost(question, game.log)} tok this turn
              </p>
            </>
          )}

          {playing && guessing && (
            <div className="ftc-row">
              <input
                className="ftc-input"
                type="text"
                placeholder="Your answer…"
                value={guess}
                maxLength={MAX_QUESTION_LEN}
                disabled={thinking}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendGuess()}
              />
              <button
                type="button"
                className="game__btn"
                onClick={sendGuess}
                disabled={thinking || !guess.trim()}
              >
                Submit guess
              </button>
              <button
                type="button"
                className="game__btn"
                onClick={() => setGuessing(false)}
                disabled={thinking}
              >
                Back
              </button>
            </div>
          )}

          {playing && (
            <p className="game__hint">
              A guess costs a turn ·{' '}
              <button type="button" className="ftc-link" onClick={getAnswer} disabled={thinking}>
                Stuck? Get the answer
              </button>
            </p>
          )}
        </>
      )}
    </main>
  );
}