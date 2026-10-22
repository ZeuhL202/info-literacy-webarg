import { createContext, useContext } from 'react';
import type { AppId } from '../game/types';

export interface NavValue {
  app: AppId | null;
  target?: string;
  open: (app: AppId, target?: string) => void;
  home: () => void;
}

export const NavContext = createContext<NavValue>({ app: null, open: () => {}, home: () => {} });

export const useNav = () => useContext(NavContext);

export const appMeta: Record<AppId, { name: string; icon: string; color: string }> = {
  chat: { name: 'チャット', icon: '💬', color: '#34c759' },
  browser: { name: 'ブラウザ', icon: '🌐', color: '#0a84ff' },
  notes: { name: '探偵ノート', icon: '📓', color: '#8e5cf7' },
  ai: { name: 'ヒカリAI', icon: '✨', color: '#1f9bb0' },
  library: { name: '図書館', icon: '📚', color: '#a0522d' },
  news: { name: '学級新聞', icon: '📰', color: '#ff9f0a' },
  album: { name: 'アルバム', icon: '🖼️', color: '#ff375f' },
  settings: { name: '設定', icon: '⚙️', color: '#8e8e93' },
  hq: { name: '探偵団本部', icon: '🔍', color: '#3a3a8c' },
};
