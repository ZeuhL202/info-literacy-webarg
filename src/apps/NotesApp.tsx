import { useState } from 'react';
import { factCheckConclusions, factCheckRows } from '../content/chapter1';
import { chapter5Clues } from '../content/chapter5';
import { clues } from '../content/clues';
import { currentChapter } from '../game/engine';
import { useGame } from '../game/store';
import { plain, T } from '../ui/Ruby';

export function NotesApp() {
  const { state } = useGame();
  const ch = currentChapter(state);
  const objective = ch?.stages[state.stage]?.objective;
  const myClues = state.clues.filter((c) => clues[c]?.chapter === state.chapter);

  return (
    <div className="notes">
      <section>
        <h3>🎯 いまのミッション</h3>
        <p>{objective ? <T>{objective}</T> : 'ミッションはありません'}</p>
      </section>

      <section>
        <h3>🪞 鏡のかけら</h3>
        <div className="fragments">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`fragment ${state.fragments[i] ? '' : 'empty'}`}>
              {state.fragments[i] ?? '?'}
            </span>
          ))}
        </div>
      </section>

      {(state.chapter === 1 || state.chapter === 5) && (
        <section>
          <h3>📌 メモした手がかり</h3>
          {myClues.length === 0 ? (
            <p className="muted">まだありません。大事なところを「📌メモする」で集めよう。</p>
          ) : (
            <ul className="clue-list">
              {myClues.map((c) => (
                <li key={c}>
                  <T>{clues[c].text}</T>
                </li>
              ))}
            </ul>
          )}
          {state.chapter === 5 && (
            <p className="muted">
              原因の手がかり:{chapter5Clues.filter((c) => state.clues.includes(c)).length} / {chapter5Clues.length}
            </p>
          )}
        </section>
      )}

      {state.chapter === 1 && state.stage >= 1 && <FactCheckSheet />}
    </div>
  );
}

/** 1章:3つの観点で、まとめ記事が本当かを確かめるシート */
function FactCheckSheet() {
  const { state, dispatch } = useGame();
  const done = !!state.flags['ch1:sheet'];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [conclusion, setConclusion] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const myClues = state.clues.filter((c) => clues[c]?.chapter === 1);

  const check = () => {
    const wrong = factCheckRows.find((r) => !(r.accept as readonly string[]).includes(answers[r.id] ?? ''));
    if (wrong) {
      setFeedback(`「${plain(wrong.question)}」に合う手がかりを、もう一度考えてみよう。`);
      return;
    }
    if (conclusion !== 'false') {
      setFeedback('3つの手がかりから考えると、記事はどうだったと言えるかな?');
      return;
    }
    setFeedback(null);
    dispatch({ type: 'flag', key: 'ch1:sheet' });
  };

  return (
    <section className="sheet">
      <h3>📝 ファクトチェックシート</h3>
      <p className="muted">調べる記事:【衝撃】ひかり池に巨大怪獣あらわる!!</p>
      {factCheckRows.map((r) => (
        <div key={r.id} className="sheet-row">
          <div className="sheet-q">
            <T>{r.question}</T>
          </div>
          <select
            value={answers[r.id] ?? ''}
            disabled={done}
            onChange={(e) => setAnswers({ ...answers, [r.id]: e.target.value })}
            aria-label={r.question}
          >
            <option value="">手がかりを選ぶ</option>
            {myClues.map((c) => (
              <option key={c} value={c}>
                {plain(clues[c].text)}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="sheet-row">
        <div className="sheet-q">けつろん:この記事は…</div>
        <div className="chips">
          {factCheckConclusions.map((c) => (
            <button
              key={c.id}
              className={`chip ${conclusion === c.id ? 'on' : ''}`}
              disabled={done}
              onClick={() => setConclusion(c.id)}
            >
              {c.text}
            </button>
          ))}
        </div>
      </div>
      {myClues.length < 3 && !done && (
        <p className="muted">手がかりが足りないかも。ブラウザで、いろいろなサイトを調べてみよう。</p>
      )}
      {feedback && <div className="tool-feedback">{feedback}</div>}
      {done ? (
        <div className="ok-box">✅ 完成!まちがった情報だとわかったね。</div>
      ) : (
        <button className="primary" onClick={check}>
          シートを完成させる
        </button>
      )}
    </section>
  );
}
