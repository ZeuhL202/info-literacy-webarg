import { useEffect, useState } from 'react';
import { clues } from '../content/clues';
import { useGame } from '../game/store';
import { useNav } from '../ui/nav';
import { T } from '../ui/Ruby';

export function SettingsApp() {
  const { state, dispatch } = useGame();
  const nav = useNav();
  const [view, setView] = useState<string | null>(nav.target ?? null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (nav.target) setView(nav.target);
  }, [nav.target]);

  if (view === 'kaito-account' && state.chapter >= 5) return <KaitoAccount onBack={() => setView(null)} />;

  return (
    <div className="settings">
      <section>
        <h3>👤 このタブレット</h3>
        <p>ニックネーム:{state.nickname}</p>
      </section>
      {state.chapter >= 5 && (
        <section>
          <h3>🛡️ 先生からの共有</h3>
          <button className="list-button" onClick={() => setView('kaito-account')}>
            カイトのアカウントの記録 ›
          </button>
        </section>
      )}
      <section>
        <h3>📖 先生・おうちの方へ</h3>
        <a className="list-button" href="#/teacher" target="_blank" rel="noreferrer">
          ねらいと使い方のページを開く ›
        </a>
      </section>
      <section>
        <h3>🔄 はじめからやり直す</h3>
        {confirmReset ? (
          <div className="confirm">
            <p>今までの進みぐあいが消えます。本当にやり直す?</p>
            <button
              className="danger-button"
              onClick={() => {
                nav.home();
                dispatch({ type: 'reset' });
              }}
            >
              やり直す
            </button>
            <button className="secondary" onClick={() => setConfirmReset(false)}>
              やめる
            </button>
          </div>
        ) : (
          <button className="secondary" onClick={() => setConfirmReset(true)}>
            はじめからやり直す
          </button>
        )}
      </section>
    </div>
  );
}

function ClueButton({ id }: { id: string }) {
  const { state, dispatch } = useGame();
  const have = state.clues.includes(id);
  if (state.chapter !== 5 && !have) return null;
  return (
    <button className={`clue ${have ? 'got' : ''}`} disabled={have} onClick={() => dispatch({ type: 'clue', id })}>
      {have ? '✅ メモした:' : '📌 原因としてメモする:'} <T>{clues[id].text}</T>
    </button>
  );
}

function KaitoAccount({ onBack }: { onBack: () => void }) {
  return (
    <div className="settings">
      <button className="link-back" onClick={onBack}>
        ‹ 設定にもどる
      </button>
      <h2>🎧 カイトのアカウントの記録</h2>
      <p className="muted">森先生が、カイトとおうちの人の了解をもらって見せてくれている画面です。</p>

      <section>
        <h3>🔑 パスワードのせってい</h3>
        <div className="record">
          <div>パスワードのヒント:たんじょうび(5月5日)</div>
          <div>パスワード:kaito●●●●(4けたの数字)</div>
          <div>さいごに変えた日:1年前</div>
        </div>
        <ClueButton id="c5-birthday" />
      </section>

      <section>
        <h3>🎮 ゲームのフレンドとのチャット(10月20日)</h3>
        <div className="record chatlog">
          <div>
            <strong>ぴかりん:</strong> アイテム交かんしよう!ぼくがやっておくから、パスワード教えて
          </div>
          <div>
            <strong>カイト:</strong> いいよ!kaito0505 だよ
          </div>
          <div>
            <strong>ぴかりん:</strong> ありがとう〜
          </div>
        </div>
        <ClueButton id="c5-told" />
      </section>

      <section>
        <h3>📋 ログインの記録</h3>
        <table className="record-table">
          <thead>
            <tr>
              <th>日時</th>
              <th>できごと</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10/21 19:02</td>
              <td>カイトのタブレットからログイン</td>
            </tr>
            <tr>
              <td>10/21 20:50</td>
              <td>「ひかりポイント当選」のページに、IDとパスワードを入力</td>
            </tr>
            <tr className="alert">
              <td>10/21 21:14</td>
              <td>知らない端末からログイン(場所:不明)</td>
            </tr>
            <tr className="alert">
              <td>10/22 07:30</td>
              <td>クラスのチャットに、同じURLを何回も送信</td>
            </tr>
          </tbody>
        </table>
        <ClueButton id="c5-prize" />
      </section>
    </div>
  );
}
