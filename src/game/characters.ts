import type { CharacterId } from './types';

export interface Character {
  name: string;
  icon: string;
  color: string;
}

export const characters: Record<CharacterId, Character> = {
  mirror: { name: 'ミラー', icon: '🪞', color: '#6b5bd6' },
  sensei: { name: '森先生', icon: '👩‍🏫', color: '#2f8f5b' },
  sora: { name: 'ソラ', icon: '🧢', color: '#e07a1f' },
  yui: { name: 'ユイ', icon: '🎀', color: '#d64f86' },
  kaito: { name: 'カイト', icon: '🎧', color: '#2f6fd6' },
  riku: { name: 'リク', icon: '⚽', color: '#c0392b' },
  haru: { name: 'ハル', icon: '🍙', color: '#8a6d1f' },
  mako: { name: 'マコ', icon: '🐰', color: '#b05cc9' },
  hikari: { name: 'ヒカリAI', icon: '✨', color: '#1f9bb0' },
};

export interface ThreadInfo {
  id: string;
  title: string;
  icon: string;
}

export const threads: ThreadInfo[] = [
  { id: 'mirror', title: 'ミラー', icon: '🪞' },
  { id: 'class', title: '5年2組 みんな', icon: '🏫' },
  { id: 'han3', title: '3班', icon: '👥' },
  { id: 'sensei', title: '森先生', icon: '👩‍🏫' },
  { id: 'sora', title: 'ソラ', icon: '🧢' },
  { id: 'kaito', title: 'カイト', icon: '🎧' },
  { id: 'riku', title: 'リク', icon: '⚽' },
  { id: 'haru', title: 'ハル', icon: '🍙' },
];
