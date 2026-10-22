import { useMemo, useState } from 'react';
import { useGame } from '../game/store';
import { useNav } from '../ui/nav';
import { T } from '../ui/Ruby';

const ANSWER = 'たしかめる';

export function HqApp() {
  const { state, dispatch } = useGame();
  const nav = useNav();
  const solved = !!state.flags['final:solved'];
  // かけらは手に入れた順ではなく、ばらばらに並べて出す
  const tiles = useMemo(() => ['め', 'た', 'る', 'か', 'し'].filter((t) => state.fragments.includes(t)), [state.fragments]);
  const [picked, setPicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const word = picked.map((i) => tiles[i]).join('');

  if (solved) {
    return (
      <div className="hq">
        <div className="hq-word">{ANSWER}</div>
        <p className="ok-box">✅ 合言葉を受けつけました。ミラーからのメッセージを見てみよう。</p>
      </div>
    );
  }

  const submit = () => {
    if (word === ANSWER) {
      dispatch({ type: 'flag', key: 'final:solved' });
      // ミラーからの最後のメッセージをすぐ読めるようにする
      nav.open('chat', 'mirror');
    } else {
      setFeedback('ちがうみたい。この探偵団で、いちばん大事にしてきたことは何だったかな?');
      setPicked([]);
    }
  };

  return (
    <div className="hq">
      <h2>🔍 探偵団本部</h2>
      <p className="muted">ここは、ほんものの探偵団本部アプリです(ホーム画面から開いたアプリ)。</p>
      <p>
        <T>{'鏡のかけらを{順番|じゅんばん}にタップして、合言葉を作ろう。'}</T>
      </p>
      <div className="hq-word">{word || '・・・・・'}</div>
      <div className="fragments">
        {tiles.map((t, i) => (
          <button key={t} className="fragment big" disabled={picked.includes(i)} onClick={() => setPicked([...picked, i])}>
            {t}
          </button>
        ))}
      </div>
      {feedback && <div className="tool-feedback">{feedback}</div>}
      <div className="row">
        <button className="secondary" onClick={() => setPicked([])}>
          やり直す
        </button>
        <button className="primary" disabled={picked.length !== tiles.length} onClick={submit}>
          合言葉を送る
        </button>
      </div>
    </div>
  );
}
