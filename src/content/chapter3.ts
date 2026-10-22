import type { Chapter } from '../game/types';
import { choice, msg } from './helpers';

/** ヒカリAIが書いた作文。wrong がまちがっている文 */
export const aiEssay = [
  { id: 'a1', text: 'ひかり町は、山と川にかこまれた町です。', wrong: false },
  { id: 'a2', text: 'ひかり橋は1985年にかけられ、町の人の生活を{便利|べんり}にしました。', wrong: true },
  { id: 'a3', text: 'ひかり池は、むかし田んぼに水を送るための「ため池」として作られました。', wrong: false },
  { id: 'a4', text: '有名な{発明家|はつめいか}の「ひかり太郎」は、ひかり町で生まれました。', wrong: true },
  { id: 'a5', text: '毎年秋には、ひかり池のまわりで秋まつりが開かれます。', wrong: false },
] as const;

/** ヒカリAIに聞ける質問と、その答え */
export const aiQuestions = [
  {
    id: 'q-bridge',
    q: 'ひかり橋は、いつできたの?',
    a: 'ひかり橋は1985年にできました。町の人の生活を便利にした、大切な橋です。',
  },
  {
    id: 'q-taro',
    q: 'ひかり太郎って、どんな人?',
    a: 'ひかり太郎は、ひかり町で生まれた有名な発明家です。たくさんの{道具|どうぐ}を発明しました。',
  },
  {
    id: 'q-sure',
    q: 'きみの答えは、ぜんぶ正しいの?',
    a: 'わたしは、たくさんの文章から言葉をつなげて答えを作っています。まちがえることもあるので、大事なことは本や信頼できる資料で確かめてくださいね。',
  },
  {
    id: 'q-address',
    q: 'ぼくの名前と住所を教えるから、覚えておいて',
    a: '名前や住所などの{個人情報|こじんじょうほう}は、AIに入力しないようにしましょう。入力したことが、どう使われるかわからないことがあります。',
  },
  {
    id: 'q-hint',
    q: 'ひかり町の歴史を調べるには、何を見ればいい?',
    a: '図書館にある町の歴史の本や、郷土資料館の資料がおすすめです。年表を見ると、出来事の順番がわかりますよ。',
  },
] as const;

export const chapter3: Chapter = {
  no: 3,
  title: 'ヒカリAIの自由研究',
  theme: '生成AIとのつきあい方',
  fragment: 'か',
  apps: ['chat', 'browser', 'notes', 'ai', 'library', 'settings'],
  stages: [
    {
      objective: 'ヒカリAIの作文と図書館の資料をくらべて、まちがいを2つ見つけよう',
      onEnter: [
        msg('haru', 'haru', '%name%、聞いて!自由研究の「ひかり町の歴史」、ヒカリAIに全部書いてもらった!', { wait: 1500 }),
        msg('haru', 'haru', 'これ、そのまま出せば終わりじゃん😎', {
          wait: 1500,
          link: { label: 'ヒカリAIの作文を見る', app: 'ai' },
        }),
        msg('mirror', 'mirror', '便利な道具ほど、使い方が大事。', { wait: 2000 }),
        msg(
          'mirror',
          'mirror',
          'ヒカリAIの作文、ぜんぶ本当かな?{図書館|としょかん}アプリの資料とくらべて、まちがっている文を2つ見つけよう。',
          { wait: 1800, link: { label: '図書館アプリを開く', app: 'library' } },
        ),
      ],
      doneWhen: (s) => !!s.flags['ch3:found'],
    },
    {
      objective: 'ハルに、AIの使い方を伝えよう(チャット → ハル)',
      onEnter: [
        msg('haru', 'haru', 'えー、まちがってたの!?ヒカリAI、あんなに自信まんまんだったのに。', { wait: 1500 }),
        msg('haru', 'haru', 'じゃあ、どうすればいいんだよ〜', { wait: 1500 }),
        choice('haru', 'ch3-use', 600),
      ],
      doneWhen: (s) => !!s.flags['choice:ch3-use'],
    },
  ],
  choices: {
    'ch3-use': {
      id: 'ch3-use',
      options: [
        {
          id: 'copy',
          text: 'まちがいの2文だけ消して、あとはそのまま出しちゃえば?',
          replies: [
            msg('haru', 'haru', 'そうする!…あれ、でもこれ、ぼくが調べたことになるのかな?', { wait: 1800 }),
            msg(
              'mirror',
              'mirror',
              'AIが作ったものをそのまま出すと、自分の学びにならないし、ほかにもまちがいがかくれているかもしれない。もう一度考えてみよう。',
              { wait: 2200 },
            ),
          ],
        },
        {
          id: 'never',
          text: 'AIはまちがえるから、もう使わない方がいいよ',
          replies: [
            msg('haru', 'haru', 'そっかぁ…でも、調べ方がわからなくて困ってたんだよな。', { wait: 1800 }),
            msg(
              'mirror',
              'mirror',
              '使うのをやめるのも一つの方法。でもAIは、上手に使えば学びを深める道具にもなる。もっといい使い方はないかな?',
              { wait: 2200 },
            ),
          ],
        },
        {
          id: 'check',
          text: 'AIの答えはヒントにして、本で確かめてから自分の言葉でまとめよう。使う前にはおうちの人にも聞いてね',
          best: true,
          replies: [
            msg('haru', 'haru', 'なるほど!AIには「何を調べればいいか」を聞いて、本で確かめて、自分で書けばいいのか。', {
              wait: 2000,
            }),
            msg('haru', 'haru', 'お母さんにも聞いてから、やってみる!', { wait: 1400 }),
          ],
        },
      ],
    },
  },
  reflection: {
    points: [
      '生成AIの答えには、まちがいがふくまれることがある',
      '教科書や本など、信頼できる資料とくらべて確かめる',
      'AIが作ったものを、そのまま提出したり発表したりしない',
      '使う前におうちの人に聞く。名前や住所などの個人情報は入力しない',
    ],
    source: '文部科学省 動画教材㉘「全部正しいの?生成AIって」',
    choiceIds: ['ch3-use'],
  },
};
