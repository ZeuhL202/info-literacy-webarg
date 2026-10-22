import { useState } from 'react';
import { newsBlocks, type NewsBlock } from '../content/chapter4';
import { useGame } from '../game/store';
import { T } from '../ui/Ruby';

export function NewsApp() {
  const { state, dispatch } = useGame();
  const finding = state.chapter === 4 && state.stage === 0;
  const fixing = state.chapter === 4 && state.stage === 1;
  const fixed = !!state.flags['ch4:fixed'] || state.chapter > 4;
  const [marked, setMarked] = useState<string[]>([]);
  const [fixes, setFixes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const problems = newsBlocks.filter((b) => b.problem);

  const toggle = (id: string) => {
    if (!finding) return;
    setFeedback(null);
    setMarked((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  };

  const checkFound = () => {
    const missed = problems.filter((b) => !marked.includes(b.id)).length;
    const extra = marked.filter((id) => !problems.some((b) => b.id === id)).length;
    if (missed === 0 && extra === 0) {
      dispatch({ type: 'flag', key: 'ch4:found' });
      return;
    }
    if (extra > 0)
      setFeedback('のせても大丈夫なものも、えらんでいるみたい。だれが作ったものか、本人がOKしているかを見てみよう。');
    else setFeedback(`直したほうがいいところが、あと${missed}つあるよ。アルバムやクラスのチャットも見てみよう。`);
  };

  const checkFixes = () => {
    const wrong = problems.find((b) => !b.fix?.options.find((o) => o.id === fixes[b.id])?.ok);
    if (wrong) {
      const opt = wrong.fix?.options.find((o) => o.id === fixes[wrong.id]);
      setFeedback(opt ? opt.why : 'まだ決めていないところがあるよ。');
      return;
    }
    dispatch({ type: 'flag', key: 'ch4:fixed' });
  };

  return (
    <div className="news">
      <div className="news-paper">
        <div className="news-masthead">ひかりっ子タイムズ 第12号</div>
        {newsBlocks.map((b) => (
          <NewsItem
            key={b.id}
            b={b}
            fixed={fixed}
            clickable={finding}
            marked={marked.includes(b.id) || ((fixing || fixed) && b.problem)}
            onClick={() => toggle(b.id)}
          />
        ))}
      </div>

      {finding && (
        <div className="tool">
          <div className="tool-title">🔎 公開する前に直したほうがいいところをタップ(えらんだ数:{marked.length})</div>
          {feedback && <div className="tool-feedback">{feedback}</div>}
          <button className="primary" disabled={marked.length === 0} onClick={checkFound}>
            チェック完了
          </button>
        </div>
      )}

      {fixing && (
        <div className="tool">
          <div className="tool-title">🛠️ どう直す?</div>
          {problems.map((b) => (
            <div key={b.id} className="tool-row">
              <div className="tool-label">
                <T>{b.fix!.question}</T>(<T>{b.caption ?? b.text}</T>)
              </div>
              <div className="chips column">
                {b.fix!.options.map((o) => (
                  <button
                    key={o.id}
                    className={`chip ${fixes[b.id] === o.id ? 'on' : ''}`}
                    onClick={() => {
                      setFixes({ ...fixes, [b.id]: o.id });
                      setFeedback(null);
                    }}
                  >
                    <T>{o.text}</T>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {feedback && (
            <div className="tool-feedback">
              <T>{feedback}</T>
            </div>
          )}
          <button className="primary" disabled={problems.some((b) => !fixes[b.id])} onClick={checkFixes}>
            この直し方で公開する
          </button>
        </div>
      )}
      {fixed && <div className="ok-box">✅ 直してから公開できたよ。だれもこまらない新聞になったね。</div>}
    </div>
  );
}

const FIXED_VIEW: Record<string, Partial<NewsBlock>> = {
  n2: { art: '🏃‍♀️🏁', caption: '写真:ゴールテープ(写っている人みんながOK)' },
  n3: { art: '🖍️⭐', caption: 'イラスト:3班でかいたオリジナルのマーク' },
  n4: { text: 'リレーのアンカーは、リクくん!' },
};

function NewsItem({
  b,
  fixed,
  clickable,
  marked,
  onClick,
}: {
  b: NewsBlock;
  fixed: boolean;
  clickable: boolean;
  marked: boolean;
  onClick: () => void;
}) {
  const view = fixed ? { ...b, ...FIXED_VIEW[b.id] } : b;
  const cls = `news-item ${clickable ? 'clickable' : ''} ${marked && !fixed ? 'marked' : ''}`;
  return (
    <div className={cls} onClick={onClick} role={clickable ? 'button' : undefined} tabIndex={clickable ? 0 : undefined}>
      {view.kind === 'title' && (
        <h2>
          <T>{view.text}</T>
        </h2>
      )}
      {(view.kind === 'photo' || view.kind === 'image') && (
        <figure className="fake-img photo">
          <div className="fake-img-art">{view.art}</div>
          <figcaption>
            <T>{view.text}</T>
            <br />
            <small>
              <T>{view.caption ?? ''}</T>
            </small>
          </figcaption>
        </figure>
      )}
      {view.kind === 'text' && (
        <p>
          <T>{view.text}</T>
        </p>
      )}
      {view.kind === 'quote' && (
        <blockquote>
          <T>{view.text}</T>
        </blockquote>
      )}
    </div>
  );
}
