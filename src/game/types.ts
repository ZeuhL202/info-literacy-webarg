export type AppId = 'chat' | 'browser' | 'notes' | 'ai' | 'library' | 'news' | 'album' | 'settings' | 'hq';

export type CharacterId = 'mirror' | 'sensei' | 'sora' | 'yui' | 'kaito' | 'riku' | 'haru' | 'mako' | 'hikari';

export type Speaker = CharacterId | 'me' | 'system';

/** メッセージ内のリンク。タップすると指定のアプリを開く */
export interface MsgLink {
  label: string;
  app: AppId;
  target?: string;
}

export interface ChatMsg {
  id: string;
  from: Speaker;
  text: string;
  link?: MsgLink;
  /** 表示用の時刻ラベル(過去ログ用) */
  time?: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  app: AppId;
  target?: string;
}

/** 章の段階に入ったときに順番に実行される出来事 */
export type GameAction =
  | { t: 'msg'; thread: string; from: Speaker; text: string; link?: MsgLink; time?: string; id?: string; wait?: number }
  | { t: 'notice'; title: string; body: string; app: AppId; target?: string; wait?: number }
  | { t: 'choice'; thread: string; choice: string; wait?: number }
  | { t: 'flag'; key: string; wait?: number };

export interface ChoiceOption {
  id: string;
  text: string;
  best?: boolean;
  /** 選んだあとに起きること */
  replies: GameAction[];
}

export interface ChoiceDef {
  id: string;
  options: ChoiceOption[];
}

export interface Stage {
  objective: string;
  onEnter: GameAction[];
  doneWhen: (s: GameState) => boolean;
}

export interface Reflection {
  points: string[];
  /** 元にした文部科学省の教材 */
  source: string;
  /** 振り返りに表示する、最初に選んだ答えの対象 */
  choiceIds: string[];
}

export interface Chapter {
  no: number;
  title: string;
  theme: string;
  fragment: string;
  apps: AppId[];
  /** 章が始まったときに、すでに届いている過去ログ */
  history?: GameAction[];
  stages: Stage[];
  choices: Record<string, ChoiceDef>;
  reflection: Reflection;
}

export interface QueuedAction {
  action: GameAction;
}

export interface ChoiceRecord {
  first: string;
  last: string;
}

export interface GameState {
  version: 1;
  nickname: string;
  /** 1〜5 が各章、6 が最終章、7 がクリア後 */
  chapter: number;
  stage: number;
  flags: Record<string, true>;
  /** 文章の差しこみ用(%name% など) */
  vars: Record<string, string>;
  clues: string[];
  fragments: string[];
  messages: Record<string, ChatMsg[]>;
  unread: Record<string, number>;
  queue: QueuedAction[];
  notices: Notice[];
  choices: Record<string, ChoiceRecord>;
  /** スレッドごとに今出ている選択肢 */
  activeChoice: Record<string, string>;
  /** 章クリア画面を出している章番号 */
  cleared: number | null;
  seq: number;
}
