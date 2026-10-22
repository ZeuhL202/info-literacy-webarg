import { Fragment, type ReactNode } from 'react';

/** 「{漢字|かんじ}」の形で書いた文字にふりがなをつけて表示する */
export function T({ children }: { children: string }) {
  return <>{renderRuby(children)}</>;
}

export function renderRuby(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\{([^|{}]+)\|([^|{}]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    parts.push(
      <ruby key={i++}>
        {m[1]}
        <rt>{m[2]}</rt>
      </ruby>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return parts;
}

/** ふりがなの記号を取りのぞいた文字列 */
export function plain(text: string): string {
  return text.replace(/\{([^|{}]+)\|([^|{}]+)\}/g, '$1');
}
