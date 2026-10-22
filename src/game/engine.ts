import { chapters } from '../content/chapters';
import type { ChatMsg, GameAction, GameState } from './types';

export const FINAL_CHAPTER = 6;
export const ENDED = 7;

export type Command =
  | { type: 'start'; nickname: string }
  | { type: 'deliver' }
  | { type: 'flag'; key: string }
  | { type: 'setVar'; key: string; value: string }
  | { type: 'clue'; id: string }
  | { type: 'choose'; choice: string; option: string }
  | { type: 'read'; thread: string }
  | { type: 'dismissNotice'; id: string }
  | { type: 'nextChapter' }
  | { type: 'load'; state: GameState }
  | { type: 'reset' };

export function initialState(): GameState {
  return {
    version: 1,
    nickname: '',
    chapter: 0,
    stage: 0,
    flags: {},
    vars: {},
    clues: [],
    fragments: [],
    messages: {},
    unread: {},
    queue: [],
    notices: [],
    choices: {},
    activeChoice: {},
    cleared: null,
    seq: 0,
  };
}

export const currentChapter = (s: GameState) => chapters.find((c) => c.no === s.chapter);

/** 文章中の %name% などを差しこむ */
export function fill(text: string, s: GameState): string {
  return text.replace(/%(\w+)%/g, (_, key: string) => (key === 'name' ? s.nickname : (s.vars[key] ?? '')));
}

function enqueue(s: GameState, actions: GameAction[]): GameState {
  return { ...s, queue: [...s.queue, ...actions.map((action) => ({ action }))] };
}

function enterChapter(s: GameState, no: number): GameState {
  const ch = chapters.find((c) => c.no === no);
  let next: GameState = { ...s, chapter: no, stage: 0, activeChoice: {} };
  if (!ch) return next;
  if (ch.history) next = enqueue(next, ch.history);
  return enqueue(next, ch.stages[0].onEnter);
}

/** 今の段階が終わっていたら、次の段階(または章クリア)へ進める */
function advance(s: GameState): GameState {
  let next = s;
  for (;;) {
    const ch = currentChapter(next);
    if (!ch || next.cleared !== null) return next;
    const stage = ch.stages[next.stage];
    if (!stage || !stage.doneWhen(next)) return next;
    const nextStage = next.stage + 1;
    if (nextStage >= ch.stages.length) {
      const fragments = ch.fragment && !next.fragments.includes(ch.fragment) ? [...next.fragments, ch.fragment] : next.fragments;
      return { ...next, stage: nextStage, fragments, cleared: ch.no };
    }
    next = enqueue({ ...next, stage: nextStage }, ch.stages[nextStage].onEnter);
  }
}

function pushMsg(s: GameState, thread: string, m: Omit<ChatMsg, 'id'> & { id?: string }): GameState {
  const id = m.id ?? `m${s.seq}`;
  const list = s.messages[thread] ?? [];
  const unread = m.from === 'me' ? (s.unread[thread] ?? 0) : (s.unread[thread] ?? 0) + 1;
  return {
    ...s,
    seq: s.seq + 1,
    messages: { ...s.messages, [thread]: [...list, { ...m, id }] },
    unread: { ...s.unread, [thread]: unread },
  };
}

function apply(s: GameState, a: GameAction): GameState {
  switch (a.t) {
    case 'msg':
      return pushMsg(s, a.thread, {
        id: a.id,
        from: a.from,
        text: fill(a.text, s),
        link: a.link,
        time: a.time,
      });
    case 'notice':
      return {
        ...s,
        seq: s.seq + 1,
        notices: [...s.notices, { id: `n${s.seq}`, title: a.title, body: a.body, app: a.app, target: a.target }],
      };
    case 'choice':
      return { ...s, activeChoice: { ...s.activeChoice, [a.thread]: a.choice } };
    case 'flag':
      return { ...s, flags: { ...s.flags, [a.key]: true } };
  }
}

export function reducer(s: GameState, cmd: Command): GameState {
  switch (cmd.type) {
    case 'load':
      return cmd.state;
    case 'reset':
      return initialState();
    case 'start':
      return enterChapter({ ...initialState(), nickname: cmd.nickname }, 1);
    case 'deliver': {
      const [head, ...rest] = s.queue;
      if (!head) return s;
      return advance(apply({ ...s, queue: rest }, head.action));
    }
    case 'flag':
      if (s.flags[cmd.key]) return s;
      return advance({ ...s, flags: { ...s.flags, [cmd.key]: true } });
    case 'setVar':
      return { ...s, vars: { ...s.vars, [cmd.key]: cmd.value } };
    case 'clue':
      if (s.clues.includes(cmd.id)) return s;
      return advance({ ...s, clues: [...s.clues, cmd.id] });
    case 'choose': {
      const ch = currentChapter(s);
      const def = ch?.choices[cmd.choice];
      const opt = def?.options.find((o) => o.id === cmd.option);
      const thread = Object.keys(s.activeChoice).find((t) => s.activeChoice[t] === cmd.choice);
      if (!def || !opt || !thread) return s;
      const activeChoice = { ...s.activeChoice };
      delete activeChoice[thread];
      const prev = s.choices[cmd.choice];
      let next: GameState = {
        ...s,
        activeChoice,
        choices: { ...s.choices, [cmd.choice]: { first: prev?.first ?? opt.id, last: opt.id } },
      };
      next = pushMsg(next, thread, { from: 'me', text: opt.text });
      next = enqueue(next, opt.replies);
      // いちばんよい答えなら次へ。そうでなければもう一度選び直せるようにする
      next = enqueue(next, [
        opt.best ? { t: 'flag', key: `choice:${cmd.choice}`, wait: 800 } : { t: 'choice', thread, choice: cmd.choice, wait: 600 },
      ]);
      return next;
    }
    case 'read':
      if (!s.unread[cmd.thread]) return s;
      return { ...s, unread: { ...s.unread, [cmd.thread]: 0 } };
    case 'dismissNotice':
      return { ...s, notices: s.notices.filter((n) => n.id !== cmd.id) };
    case 'nextChapter': {
      if (s.cleared === null) return s;
      const no = s.cleared + 1;
      if (no > FINAL_CHAPTER) return { ...s, cleared: null, chapter: ENDED };
      return enterChapter({ ...s, cleared: null }, no);
    }
  }
}

/** 次の出来事までの待ち時間 */
export function nextDelay(s: GameState): number | null {
  const head = s.queue[0];
  if (!head) return null;
  if (head.action.wait !== undefined) return head.action.wait;
  return head.action.t === 'msg' ? 1200 : 400;
}
