import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { initialState, nextDelay, reducer, type Command } from './engine';
import type { GameState } from './types';

const STORAGE_KEY = 'hikari-arg-save-v1';

/** 動作確認用:?speed=10 で、メッセージが10倍の速さで届く */
const SPEED = Math.max(1, Number(new URLSearchParams(window.location.search).get('speed')) || 1);

function loadSaved(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as GameState;
      if (parsed.version === 1) return { ...initialState(), ...parsed };
    }
  } catch {
    // 保存が使えない環境では、最初から始める
  }
  return initialState();
}

function save(s: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // 保存できなくても遊べるようにする
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<Command>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadSaved);

  useEffect(() => save(state), [state]);

  // 出来事を、待ち時間をおいて1つずつ届ける
  const delay = nextDelay(state);
  const queueHead = state.queue[0];
  useEffect(() => {
    if (delay === null) return;
    const timer = window.setTimeout(() => dispatch({ type: 'deliver' }), delay / SPEED);
    return () => window.clearTimeout(timer);
  }, [delay, queueHead]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
