import type { AppId, GameAction, MsgLink, Speaker } from '../game/types';

/** チャットのメッセージを1つ届ける。wait はひとつ前の出来事からの待ち時間(ミリ秒) */
export function msg(
  thread: string,
  from: Speaker,
  text: string,
  opts: { link?: MsgLink; wait?: number; time?: string } = {},
): GameAction {
  return { t: 'msg', thread, from, text, ...opts };
}

/** 過去ログ用。待ち時間なしで届く */
export function log(thread: string, from: Speaker, text: string, time: string, link?: MsgLink): GameAction {
  return { t: 'msg', thread, from, text, time, link, wait: 0 };
}

export function notice(title: string, body: string, app: AppId, target?: string, wait?: number): GameAction {
  return { t: 'notice', title, body, app, target, wait };
}

export function choice(thread: string, id: string, wait?: number): GameAction {
  return { t: 'choice', thread, choice: id, wait };
}

export function flag(key: string, wait = 0): GameAction {
  return { t: 'flag', key, wait };
}
