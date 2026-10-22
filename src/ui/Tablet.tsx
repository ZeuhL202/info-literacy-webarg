import { useEffect, useMemo, useState } from 'react';
import { appsFor } from '../content/chapters';
import { currentChapter } from '../game/engine';
import { useGame } from '../game/store';
import type { AppId } from '../game/types';
import { AiApp } from '../apps/AiApp';
import { AlbumApp } from '../apps/AlbumApp';
import { BrowserApp } from '../apps/BrowserApp';
import { ChatApp } from '../apps/ChatApp';
import { HqApp } from '../apps/HqApp';
import { LibraryApp } from '../apps/LibraryApp';
import { NewsApp } from '../apps/NewsApp';
import { NotesApp } from '../apps/NotesApp';
import { SettingsApp } from '../apps/SettingsApp';
import { ChapterClear } from './ChapterClear';
import { appMeta, NavContext, type NavValue } from './nav';
import { T } from './Ruby';

const BREAK_AFTER_MS = 20 * 60 * 1000;

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

export function Tablet() {
  const { state, dispatch } = useGame();
  const [app, setApp] = useState<AppId | null>(null);
  const [target, setTarget] = useState<string | undefined>();
  const [showBreak, setShowBreak] = useState(false);
  const now = useClock();
  const chapter = currentChapter(state);
  const apps = appsFor(state.chapter);

  // 20分続けて遊んだら、目を休めるようにうながす
  useEffect(() => {
    const t = window.setTimeout(() => setShowBreak(true), BREAK_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [showBreak]);

  const nav: NavValue = useMemo(
    () => ({
      app,
      target,
      open: (a, t) => {
        setApp(a);
        setTarget(t);
      },
      home: () => {
        setApp(null);
        setTarget(undefined);
      },
    }),
    [app, target],
  );

  const unreadTotal = Object.values(state.unread).reduce((a, b) => a + b, 0);
  const notice = state.notices[0];
  const objective = chapter?.stages[state.stage]?.objective;

  return (
    <NavContext.Provider value={nav}>
      <div className="tablet">
        <div className="statusbar">
          <span>{now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="statusbar-title">
            {chapter ? (chapter.no <= 5 ? `第${chapter.no}章 ${chapter.title}` : chapter.title) : ''}
          </span>
          <span>📶 🔋</span>
        </div>

        <div className="screen">
          {app === null ? (
            <div className="home">
              <div className="home-grid">
                {apps.map((id) => (
                  <button key={id} className="app-icon" onClick={() => nav.open(id)}>
                    <span className="app-icon-img" style={{ background: appMeta[id].color }}>
                      {appMeta[id].icon}
                      {id === 'chat' && unreadTotal > 0 && <span className="badge">{unreadTotal}</span>}
                    </span>
                    <span className="app-icon-label">{appMeta[id].name}</span>
                  </button>
                ))}
              </div>
              <div className="home-bottom">
                {state.fragments.length > 0 && (
                  <div className="home-fragments">
                    <span>鏡のかけら</span>
                    {state.fragments.map((f) => (
                      <span key={f} className="fragment small">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
                {objective && (
                  <div className="mission">
                    <div className="mission-label">いまのミッション</div>
                    <div>
                      <T>{objective}</T>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="app-window">
              <div className="app-header" style={{ background: appMeta[app].color }}>
                <button className="back" onClick={nav.home} aria-label="ホームにもどる">
                  ← ホーム
                </button>
                <span>
                  {appMeta[app].icon} {appMeta[app].name}
                </span>
              </div>
              <div className="app-body">
                {app === 'chat' && <ChatApp />}
                {app === 'browser' && <BrowserApp />}
                {app === 'notes' && <NotesApp />}
                {app === 'ai' && <AiApp />}
                {app === 'library' && <LibraryApp />}
                {app === 'news' && <NewsApp />}
                {app === 'album' && <AlbumApp />}
                {app === 'settings' && <SettingsApp />}
                {app === 'hq' && <HqApp />}
              </div>
            </div>
          )}

          {notice && (
            <div className="notice" role="status">
              <button
                className="notice-main"
                onClick={() => {
                  dispatch({ type: 'dismissNotice', id: notice.id });
                  nav.open(notice.app, notice.target);
                }}
              >
                <strong>{notice.title}</strong>
                <span>{notice.body}</span>
              </button>
              <button
                className="notice-close"
                onClick={() => dispatch({ type: 'dismissNotice', id: notice.id })}
                aria-label="通知を閉じる"
              >
                ×
              </button>
            </div>
          )}

          {showBreak && (
            <div className="overlay">
              <div className="card">
                <h2>👀 目を休めよう</h2>
                <p>
                  <T>
                    {
                      '20分たったよ。まどの外など、遠くを20秒ながめてみよう。つかれていたら、今日はここまでにしても大丈夫。進みぐあいは{保存|ほぞん}されているよ。'
                    }
                  </T>
                </p>
                <button className="primary" onClick={() => setShowBreak(false)}>
                  休けいしたよ
                </button>
              </div>
            </div>
          )}

          {/* 章の最後のメッセージを読み終えてから、クリア画面を出す */}
          {state.cleared !== null && state.queue.length === 0 && <ChapterClear />}
        </div>
      </div>
    </NavContext.Provider>
  );
}
