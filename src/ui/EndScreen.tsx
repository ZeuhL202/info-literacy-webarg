import { chapters } from '../content/chapters';
import { useGame } from '../game/store';
import { T } from './Ruby';

export function EndScreen() {
  const { state, dispatch } = useGame();
  const story = chapters.filter((c) => c.no <= 5);

  return (
    <div className="end-screen">
      <div className="certificate">
        <div className="cert-title">デジタル探偵 認定証</div>
        <div className="cert-name">{state.nickname} さん</div>
        <p>
          <T>
            {
              'あなたは、ひかり町のネットの「ゆがみ」を5つ見ぬき、町のみんなを助けました。これからも「たしかめる」人でいてください。'
            }
          </T>
        </p>
        <div className="cert-word">たしかめる</div>
        <div className="cert-sign">ひかり町デジタル探偵団 / ミラー 🪞</div>
      </div>

      <h2>5つの「ゆがみ」のふりかえり</h2>
      <ol className="end-list">
        {story.map((c) => (
          <li key={c.no}>
            <strong>
              <T>{c.title}</T>
            </strong>
            :<T>{c.theme}</T>
            <ul>
              {c.reflection.points.map((p) => (
                <li key={p}>
                  <T>{p}</T>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <button className="secondary" onClick={() => dispatch({ type: 'reset' })}>
        はじめからもう一度遊ぶ
      </button>
    </div>
  );
}
