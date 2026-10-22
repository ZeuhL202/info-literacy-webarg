import type { AppId, Chapter } from '../game/types';
import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { chapter3 } from './chapter3';
import { chapter4 } from './chapter4';
import { chapter5, finale } from './chapter5';

export const chapters: Chapter[] = [chapter1, chapter2, chapter3, chapter4, chapter5, finale];

/** その章で使えるアプリ。クリア後はすべて使える */
export function appsFor(chapter: number): AppId[] {
  const ch = chapters.find((c) => c.no === chapter) ?? chapters[chapters.length - 1];
  return ch.apps;
}
