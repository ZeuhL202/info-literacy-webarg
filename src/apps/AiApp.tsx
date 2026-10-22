import { useState } from 'react';
import { aiEssay, aiQuestions } from '../content/chapter3';
import { useGame } from '../game/store';
import { T } from '../ui/Ruby';

export function AiApp() {
  const { state, dispatch } = useGame();
  const [asked, setAsked] = useState<string[]>([]);
  const [marked, setMarked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const solving = state.chapter === 3 && state.stage === 0;
  const found = !!state.flags['ch3:found'];

  const toggle = (id: string) => {
    if (!solving) return;
    setFeedback(null);
    setMarked((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  };

  const check = () => {
    const wrongIds = aiEssay.filter((s) => s.wrong).map((s) => s.id as string);
    const missed = wrongIds.filter((id) => !marked.includes(id)).length;
    const extra = marked.filter((id) => !wrongIds.includes(id)).length;
    if (missed === 0 && extra === 0) {
      dispatch({ type: 'flag', key: 'ch3:found' });
      return;
    }
    if (extra > 0) setFeedback('図書館の資料と同じことが書いてある文も、えらんでいるみたい。もう一度くらべてみよう。');
    else setFeedback(`まちがいは、あと${missed}つあるよ。図書館の年表や人物のページとくらべてみよう。`);
  };

  return (
    <div className="ai">
      <div className="ai-disclaimer">※ヒカリAIは、まちがえることがあります。大事なことは確かめてください。</div>
      <div className="msg mine">
        <div className="msg-body">
          <div className="bubble">ひかり町の歴史について、自由研究の作文を書いて(ハル)</div>
        </div>
      </div>
      <div className="msg">
        <span className="avatar small">✨</span>
        <div className="msg-body">
          <div className="msg-name">ヒカリAI</div>
          <div className="bubble ai-essay">
            <p>はい!ひかり町の歴史の作文です。</p>
            {aiEssay.map((s) => {
              const on = marked.includes(s.id) || (found && s.wrong);
              return (
                <span
                  key={s.id}
                  className={`sentence ${solving ? 'clickable' : ''} ${on ? 'marked' : ''}`}
                  onClick={() => toggle(s.id)}
                  role={solving ? 'button' : undefined}
                  tabIndex={solving ? 0 : undefined}
                >
                  <T>{s.text}</T>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {solving && (
        <div className="tool">
          <div className="tool-title">🔎 あやしい文をタップしてね(えらんだ文:{marked.length})</div>
          {feedback && <div className="tool-feedback">{feedback}</div>}
          <button className="primary" disabled={marked.length === 0} onClick={check}>
            これがまちがいだ!
          </button>
        </div>
      )}
      {found && <div className="ok-box">✅ まちがいを2つ見つけた!ひかり橋は1925年。「ひかり太郎」という人の記録はなかった。</div>}

      {asked.map((id) => {
        const q = aiQuestions.find((x) => x.id === id)!;
        return (
          <div key={id}>
            <div className="msg mine">
              <div className="msg-body">
                <div className="bubble">
                  <T>{q.q}</T>
                </div>
              </div>
            </div>
            <div className="msg">
              <span className="avatar small">✨</span>
              <div className="msg-body">
                <div className="bubble">
                  <T>{q.a}</T>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="choices">
        <div className="choices-label">ヒカリAIに聞いてみる</div>
        {aiQuestions
          .filter((q) => !asked.includes(q.id))
          .map((q) => (
            <button key={q.id} onClick={() => setAsked([...asked, q.id])}>
              <T>{q.q}</T>
            </button>
          ))}
      </div>
    </div>
  );
}
