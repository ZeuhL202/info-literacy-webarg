import { useEffect, useRef, useState } from 'react';
import { misunderstandingMsgId, rephraseSlots } from '../content/chapter2';
import { characters, threads } from '../game/characters';
import { currentChapter } from '../game/engine';
import { useGame } from '../game/store';
import type { ChatMsg } from '../game/types';
import { useNav } from '../ui/nav';
import { plain, T } from '../ui/Ruby';

export function ChatApp() {
  const { state } = useGame();
  const nav = useNav();
  const [thread, setThread] = useState<string | null>(nav.target ?? null);

  useEffect(() => {
    if (nav.target) setThread(nav.target);
  }, [nav.target]);

  if (thread) return <ThreadView thread={thread} onBack={() => setThread(null)} />;

  const visible = threads.filter((t) => (state.messages[t.id]?.length ?? 0) > 0);
  return (
    <ul className="thread-list">
      {visible.map((t) => {
        const list = state.messages[t.id] ?? [];
        const last = list[list.length - 1];
        const unread = state.unread[t.id] ?? 0;
        return (
          <li key={t.id}>
            <button onClick={() => setThread(t.id)}>
              <span className="avatar">{t.icon}</span>
              <span className="thread-text">
                <strong>{t.title}</strong>
                <span className="thread-last">{last ? plain(last.text) : ''}</span>
              </span>
              {unread > 0 && <span className="badge inline">{unread}</span>}
              {state.activeChoice[t.id] && unread === 0 && <span className="badge inline">!</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ThreadView({ thread, onBack }: { thread: string; onBack: () => void }) {
  const { state, dispatch } = useGame();
  const info = threads.find((t) => t.id === thread);
  const list = state.messages[thread] ?? [];
  const bottom = useRef<HTMLDivElement>(null);
  const head = state.queue[0]?.action;
  const typing = head?.t === 'msg' && head.thread === thread && head.from !== 'me' && head.from !== 'system' && head.wait !== 0;
  const ch = currentChapter(state);
  const choiceId = state.activeChoice[thread];
  const choice = choiceId ? ch?.choices[choiceId] : undefined;

  useEffect(() => {
    dispatch({ type: 'read', thread });
  }, [dispatch, thread, list.length]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [list.length, typing, choiceId]);

  const investigating = state.chapter === 2 && state.stage === 0 && thread === 'han3';
  const rephrasing = state.chapter === 2 && state.stage === 1 && thread === 'kaito';

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="link-back" onClick={onBack}>
          ‹ もどる
        </button>
        <strong>{info?.title ?? thread}</strong>
      </div>
      {investigating && <div className="hint-bar">🔎 すれちがいが始まったメッセージをタップしてね</div>}
      <div className="messages">
        {list.map((m) => (
          <Message key={m.id} m={m} investigating={investigating} />
        ))}
        {typing && (
          <div className="msg">
            <span className="avatar small">{characters[head.from as keyof typeof characters]?.icon}</span>
            <div className="bubble typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>
      {rephrasing && <RephraseTool />}
      {choice && (
        <div className="choices">
          <div className="choices-label">へんじを選ぼう</div>
          {choice.options.map((o) => (
            <button key={o.id} onClick={() => dispatch({ type: 'choose', choice: choice.id, option: o.id })}>
              <T>{o.text}</T>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Message({ m, investigating }: { m: ChatMsg; investigating: boolean }) {
  const { dispatch } = useGame();
  const nav = useNav();
  const [feedback, setFeedback] = useState<string | null>(null);

  if (m.from === 'system') {
    return (
      <div className="msg-system">
        <T>{m.text}</T>
      </div>
    );
  }
  const mine = m.from === 'me';
  const c = m.from === 'me' ? null : characters[m.from];

  const investigate = () => {
    if (!investigating) return;
    if (m.id === misunderstandingMsgId) {
      setFeedback('ここだ!「それでいいんじゃない」は、「どうでもいい」とも読めてしまう。');
      window.setTimeout(() => dispatch({ type: 'flag', key: 'ch2:found' }), 1500);
    } else {
      setFeedback('このメッセージより前に、きっかけがあったみたい。');
    }
  };

  return (
    <div className={`msg ${mine ? 'mine' : ''}`}>
      {!mine && <span className="avatar small">{c?.icon}</span>}
      <div className="msg-body">
        {!mine && (
          <div className="msg-name" style={{ color: c?.color }}>
            {c?.name}
          </div>
        )}
        <div
          className={`bubble ${investigating ? 'clickable' : ''}`}
          onClick={investigate}
          role={investigating ? 'button' : undefined}
          tabIndex={investigating ? 0 : undefined}
        >
          <T>{m.text}</T>
          {m.link && (
            <button className="link-card" onClick={() => nav.open(m.link!.app, m.link!.target)}>
              🔗 <T>{m.link.label}</T>
            </button>
          )}
        </div>
        {m.time && <div className="msg-time">{m.time}</div>}
        {feedback && (
          <div className="investigate-feedback">
            🔎 <T>{feedback}</T>
          </div>
        )}
      </div>
    </div>
  );
}

/** 2章:カイトといっしょにメッセージを言いかえる */
function RephraseTool() {
  const { dispatch } = useGame();
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  const parts = rephraseSlots.map((slot) => slot.options.find((o) => o.id === picked[slot.id]));
  const ready = parts.every(Boolean);
  const preview = parts
    .filter((p) => p && !p.text.startsWith('('))
    .map((p) => plain(p!.text))
    .join(' ');

  const check = () => {
    if (parts.every((p) => p?.ok)) {
      dispatch({ type: 'setVar', key: 'rephrase', value: preview });
      dispatch({ type: 'flag', key: 'ch2:rephrased' });
      return;
    }
    const [feeling, reason] = parts;
    if (!feeling?.ok) setResult('「気持ち」の言葉が、まだそっけなく読めてしまうかも。ユイが読んだら、どう感じるかな?');
    else if (!reason?.ok) setResult('どうしてその案がいいと思ったのか、理由があると、もっと気持ちが伝わるよ。');
    else setResult('「早く決めよう」だと、急かしているように読めるかも。');
  };

  return (
    <div className="tool">
      <div className="tool-title">💡 言いかえメーカー</div>
      {rephraseSlots.map((slot) => (
        <div key={slot.id} className="tool-row">
          <div className="tool-label">
            <T>{slot.label}</T>
          </div>
          <div className="chips">
            {slot.options.map((o) => (
              <button
                key={o.id}
                className={`chip ${picked[slot.id] === o.id ? 'on' : ''}`}
                onClick={() => {
                  setPicked({ ...picked, [slot.id]: o.id });
                  setResult(null);
                }}
              >
                <T>{o.text}</T>
              </button>
            ))}
          </div>
        </div>
      ))}
      {ready && <div className="preview">送る文:「{preview}」</div>}
      {result && <div className="tool-feedback">{result}</div>}
      <button className="primary" disabled={!ready} onClick={check}>
        この文でカイトに提案する
      </button>
    </div>
  );
}
