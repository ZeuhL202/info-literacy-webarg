import type { Chapter } from '../game/types';
import { choice, log, msg } from './helpers';

/** 1章のファクトチェックシート。観点ごとに当てはまる手がかり */
export const factCheckRows = [
  {
    id: 'media',
    question: '① ほかの人やメディアは、どう{伝|つた}えている?',
    accept: ['c1-news', 'c1-official'],
  },
  {
    id: 'others',
    question: '② 同じ{情報|じょうほう}が、ほかからも出ている?',
    accept: ['c1-copy'],
  },
  {
    id: 'sender',
    question: '③ {発信|はっしん}しているのは、{信頼|しんらい}できるところ?',
    accept: ['c1-anon', 'c1-fake'],
  },
] as const;

export const factCheckConclusions = [
  { id: 'true', text: '本当だった' },
  { id: 'false', text: 'まちがった情報だった' },
  { id: 'unknown', text: 'まだわからない' },
] as const;

export const chapter1: Chapter = {
  no: 1,
  title: 'ひかり池の怪獣',
  theme: 'ネットのうわさを{確|たし}かめる',
  fragment: 'た',
  apps: ['chat', 'browser', 'notes', 'settings'],
  history: [
    log('class', 'yui', '明日の図工、{絵|え}の具わすれないようにね', '昨日 18:02'),
    log('class', 'riku', 'りょうかい!', '昨日 18:05'),
  ],
  stages: [
    {
      objective: 'ソラが送ってきた記事を読んでみよう(チャット → 5年2組 みんな)',
      onEnter: [
        msg(
          'class',
          'sensei',
          '{転校生|てんこうせい}の%name%さん、ひかり小学校へようこそ!タブレットのアプリを、いろいろ使ってみてね。',
          { wait: 800 },
        ),
        msg('mirror', 'mirror', 'はじめまして、%name%。', { wait: 2200 }),
        msg('mirror', 'mirror', 'この町のネットには「ゆがみ」がある。きみに{見|み}ぬけるかな?', { wait: 1800 }),
        msg('class', 'sora', 'みんな見て!!ひかり池に{怪獣|かいじゅう}が出たって!!', {
          wait: 2500,
          link: { label: '【{衝撃|しょうげき}】ひかり池に{巨大|きょだい}怪獣あらわる!!', app: 'browser', target: 'matome' },
        }),
        msg('class', 'riku', 'え、まじ!?', { wait: 1200 }),
      ],
      doneWhen: (s) => !!s.flags['visit:matome'],
    },
    {
      objective: 'ブラウザで調べて、{探偵|たんてい}ノートの「ファクトチェックシート」を{完成|かんせい}させよう',
      onEnter: [
        msg('class', 'sora', 'やばくない?明日の朝、みんなで見に行こうよ!', { wait: 1500 }),
        msg('mirror', 'mirror', 'その記事、本当かな?', { wait: 2000 }),
        msg(
          'mirror',
          'mirror',
          '{調|しら}べるときのポイントは3つ。\n① ほかの人やメディアは、どう伝えている?\n② 同じ情報が、ほかからも出ている?\n③ 発信しているのは、信頼できるところ?',
          { wait: 1800 },
        ),
        msg(
          'mirror',
          'mirror',
          'ブラウザで調べて、大事なところは「📌メモ」しよう。メモがたまったら、探偵ノートのファクトチェックシートを完成させてごらん。',
          { wait: 2000, link: { label: '探偵ノートを開く', app: 'notes' } },
        ),
      ],
      doneWhen: (s) => !!s.flags['ch1:sheet'],
    },
    {
      objective: 'ソラに返事をしよう(チャット → ソラ)',
      onEnter: [
        msg('sora', 'sora', '%name%も明日、池に行くよね?', { wait: 1200 }),
        msg('sora', 'sora', 'この記事、ほかのクラスのみんなにも回しちゃおう!', { wait: 1500 }),
        choice('sora', 'ch1-share', 600),
      ],
      doneWhen: (s) => !!s.flags['choice:ch1-share'],
    },
  ],
  choices: {
    'ch1-share': {
      id: 'ch1-share',
      options: [
        {
          id: 'spread',
          text: 'いいね!みんなに{広|ひろ}めよう',
          replies: [
            msg('class', 'riku', 'となりのクラスにも回しといた!', { wait: 1500 }),
            msg('class', 'yui', '弟がこわがって、外で遊べないって…', { wait: 1800 }),
            msg(
              'mirror',
              'mirror',
              'あっというまに広がった…。まちがった情報を広めると、信じた人がこまったり、町の人にめいわくがかかったりする。もう一度考えてみよう。',
              { wait: 2200 },
            ),
          ],
        },
        {
          id: 'tell',
          text: 'ちょっと待って!調べたら、秋まつりのバルーンだったよ。町役場も「事実ではない」って',
          best: true,
          replies: [
            msg('sora', 'sora', 'えっ、そうなの!?', { wait: 1200 }),
            msg('sora', 'sora', 'あぶなかった…クラスのみんなに回すところだった。教えてくれてありがとう!', { wait: 1800 }),
            msg('class', 'sora', 'さっきの怪獣の記事、まちがいだったみたい!ごめん!ひかり新聞にのってたよ', { wait: 1800 }),
          ],
        },
        {
          id: 'ignore',
          text: '(返事をしないでおく)',
          replies: [
            msg('class', 'sora', '明日6時に池に集合!となりのクラスにも言っとくね!', { wait: 1500 }),
            msg('mirror', 'mirror', 'だまっていると、まちがいは広がり続けるかもしれない。わかったことを、ソラに伝えてみよう。', {
              wait: 2200,
            }),
          ],
        },
      ],
    },
  },
  reflection: {
    points: [
      'ネットには、わざと作られたうそや、かんちがいの情報もある',
      '①ほかのメディアの伝え方 ②ほかからも出ているか ③だれが発信しているか、で確かめる',
      '確かめるまでは、広めない',
    ],
    source: '文部科学省 動画教材㉕「本当か確かめよう!ネット検索編」',
    choiceIds: ['ch1-share'],
  },
};
