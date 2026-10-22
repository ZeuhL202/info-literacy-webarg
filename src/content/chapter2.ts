import type { Chapter } from '../game/types';
import { choice, log, msg } from './helpers';

/** 3班の過去ログのうち、すれちがいのきっかけになったメッセージ */
export const misunderstandingMsgId = 'han3-kaito';

/** 言いかえメーカーの部品。best が正しい組み立て */
export const rephraseSlots = [
  {
    id: 'feeling',
    label: '気持ち',
    options: [
      { id: 'f1', text: 'いいね!', ok: true },
      { id: 'f2', text: 'それでいいんじゃない', ok: false },
      { id: 'f3', text: 'べつに', ok: false },
    ],
  },
  {
    id: 'reason',
    label: '{理由|りゆう}',
    options: [
      { id: 'r1', text: '池の生き物、ぼくも調べてみたかったんだ。', ok: true },
      { id: 'r2', text: 'ほかに思いつかないし。', ok: false },
      { id: 'r3', text: '(書かない)', ok: false },
    ],
  },
  {
    id: 'extra',
    label: 'つけたし',
    options: [
      { id: 'e1', text: 'ぼくはザリガニを{担当|たんとう}しようか?', ok: true },
      { id: 'e2', text: '早く決めよう。', ok: false },
      { id: 'e3', text: '(書かない)', ok: true },
    ],
  },
] as const;

export const chapter2: Chapter = {
  no: 2,
  title: '3班のすれちがい',
  theme: '文字だけのやりとりで起きる{誤解|ごかい}',
  fragment: 'し',
  apps: ['chat', 'browser', 'notes', 'settings'],
  history: [
    log('han3', 'yui', '自由研究のポスター、テーマを決めよう!', '昨日 19:10'),
    log('han3', 'yui', 'わたしは「ひかり池の生き物」がいいと思うんだけど、どうかな?', '昨日 19:11'),
    {
      t: 'msg',
      thread: 'han3',
      from: 'kaito',
      text: 'それでいいんじゃない',
      time: '昨日 19:15',
      id: misunderstandingMsgId,
      wait: 0,
    },
    log('han3', 'yui', '…なにそれ。どうでもいいってこと?', '昨日 19:16'),
    log('han3', 'riku', 'カイトっていつもそうだよなー', '昨日 19:17'),
    log('han3', 'sora', 'え、けんか?', '昨日 19:20'),
    log('han3', 'yui', 'もういい。わたしが一人で決める', '昨日 19:21'),
    log('han3', 'system', 'カイトがグループを{退出|たいしゅつ}しました', '昨日 19:22'),
  ],
  stages: [
    {
      objective: '3班のチャットで、すれちがいが始まったメッセージを見つけよう(メッセージをタップ)',
      onEnter: [
        msg('mirror', 'mirror', '次の「ゆがみ」は3班のチャットだ。昨日の夜、何があったんだろう?', { wait: 1500 }),
        msg(
          'mirror',
          'mirror',
          'どの言葉から、すれちがいが始まったのかな?3班のチャットで、気になるメッセージをタップして「しらべる」を選んでごらん。',
          { wait: 2000, link: { label: '3班のチャットを開く', app: 'chat', target: 'han3' } },
        ),
      ],
      doneWhen: (s) => !!s.flags['ch2:found'],
    },
    {
      objective: 'カイトといっしょに、メッセージの言いかえを考えよう(チャット → カイト)',
      onEnter: [
        msg('kaito', 'kaito', '…%name%、ちょっといい?', { wait: 1500 }),
        msg(
          'kaito',
          'kaito',
          'ぼく、ユイの案がいいと思ったから「それでいいんじゃない」って書いたんだ。なんでおこられたんだろう。',
          { wait: 2200 },
        ),
        msg(
          'mirror',
          'mirror',
          '文字だけだと、顔や声の調子が伝わらない。「それでいいんじゃない」は、「どうでもいい」とも読めてしまうんだ。カイトといっしょに、伝わる言い方を考えてあげよう。',
          { wait: 2200, link: { label: 'カイトとのチャットを開く', app: 'chat', target: 'kaito' } },
        ),
      ],
      doneWhen: (s) => !!s.flags['ch2:rephrased'],
    },
    {
      objective: 'リクに返事をしよう(チャット → リク)',
      onEnter: [
        msg('kaito', 'kaito', 'ありがとう。これ、3班にもう一回送ってみる。', { wait: 1200 }),
        msg('han3', 'system', 'カイトがグループに参加しました', { wait: 1500 }),
        msg('han3', 'kaito', '%rephrase%', { wait: 1500 }),
        msg('han3', 'yui', 'そういう意味だったんだ!わたしこそ、きつく言ってごめんね。', { wait: 2000 }),
        msg('han3', 'yui', 'ザリガニ担当、よろしく!', { wait: 1200 }),
        msg('riku', 'riku', 'なあ%name%、カイトってちょっとノリ悪くね?', { wait: 2500 }),
        msg('riku', 'riku', 'カイトぬきのグループ作ろうぜ😆', { wait: 1500 }),
        choice('riku', 'ch2-group', 600),
      ],
      doneWhen: (s) => !!s.flags['choice:ch2-group'],
    },
  ],
  choices: {
    'ch2-group': {
      id: 'ch2-group',
      options: [
        {
          id: 'join',
          text: 'いいよ、作ろう',
          replies: [
            msg('riku', 'riku', 'よっしゃ!じゃあカイトのこと、みんなで話そうぜ', { wait: 1500 }),
            msg(
              'mirror',
              'mirror',
              'その場にいない人のことを言うグループは、いじめにつながることがある。見えない場所の言葉も、いつか本人にとどくかもしれない。もう一度考えてみよう。',
              { wait: 2200 },
            ),
          ],
        },
        {
          id: 'talk',
          text: 'それはやめよう。カイトは悪気なかったみたいだよ。明日、直接話してみない?',
          best: true,
          replies: [
            msg('riku', 'riku', '…そっか。たしかに、おれも「いつもそう」って言いすぎたかも。', { wait: 1800 }),
            msg('riku', 'riku', '明日、カイトにあやまるわ。', { wait: 1400 }),
          ],
        },
        {
          id: 'ignore',
          text: '(既読のまま返事をしない)',
          replies: [
            msg('riku', 'riku', '既読ついてるのに無視かよー', { wait: 1500 }),
            msg('mirror', 'mirror', '返事がないのも、文字の世界では誤解のもと。自分の考えを、やさしく伝えてみよう。', {
              wait: 2000,
            }),
          ],
        },
      ],
    },
  },
  reflection: {
    points: [
      '文字だけのやりとりは、顔や声の調子が伝わらず、誤解が生まれやすい',
      '送る前に「相手にどう読まれるかな?」と読み返す',
      '誤解が起きたら早めに説明する。大事な話は直接話す',
      'その場にいない人の悪口に加わらない',
    ],
    source: '文部科学省 動画教材⑳「思ったままSNSに送信しただけなのに」',
    choiceIds: ['ch2-group'],
  },
};
