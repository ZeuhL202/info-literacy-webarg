import { chapters } from '../content/chapters';
import { useGame } from '../game/store';
import { useNav } from './nav';
import { T } from './Ruby';

export function ChapterClear() {
  const { state, dispatch } = useGame();
  const nav = useNav();
  const ch = chapters.find((c) => c.no === state.cleared);
  if (!ch) return null;

  const next = () => {
    nav.home();
    dispatch({ type: 'nextChapter' });
  };

  if (ch.no > 5) {
    return (
      <div className="overlay">
        <div className="card clear-card">
          <h2>🪞 ミラーの正体がわかった</h2>
          <p>すべての「ゆがみ」が直ったよ。</p>
          <button className="primary" onClick={next}>
            エンディングへ
          </button>
        </div>
      </div>
    );
  }

  const changed = ch.reflection.choiceIds
    .map((id) => {
      const rec = state.choices[id];
      const def = ch.choices[id];
      if (!rec || !def || rec.first === rec.last) return null;
      return def.options.find((o) => o.id === rec.first)?.text ?? null;
    })
    .filter((t): t is string => t !== null);

  return (
    <div className="overlay">
      <div className="card clear-card">
        <div className="clear-chapter">第{ch.no}章 クリア</div>
        <h2>
          <T>{ch.title}</T>
        </h2>
        <div className="fragment-get">
          <span className="fragment">{ch.fragment}</span>
          <span>鏡のかけら「{ch.fragment}」を手に入れた!</span>
        </div>

        <h3>ふりかえりカード</h3>
        <ul className="points">
          {ch.reflection.points.map((p) => (
            <li key={p}>
              <T>{p}</T>
            </li>
          ))}
        </ul>
        {changed.length > 0 && (
          <p className="first-choice">
            さいしょは「<T>{changed[0]}</T>」を選んだね。考え直して、よりよい答えにたどりついたよ。
          </p>
        )}
        <p className="source">
          もとにした教材:<T>{ch.reflection.source}</T>
        </p>
        <p className="rest">
          <T>{'☕ 1つの章がおわったよ。ここで休けいしても大丈夫。続きは次に開いたときから遊べるよ。'}</T>
        </p>
        <button className="primary" onClick={next}>
          {ch.no === 5 ? '最終章へ' : '次の章へ'}
        </button>
      </div>
    </div>
  );
}
