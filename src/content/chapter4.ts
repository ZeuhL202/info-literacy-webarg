import type { Chapter } from '../game/types';
import { log, msg } from './helpers';

export interface NewsBlock {
  id: string;
  kind: 'title' | 'text' | 'photo' | 'image' | 'quote';
  text: string;
  /** 写真・画像のときの絵 */
  art?: string;
  caption?: string;
  problem: boolean;
  fix?: { question: string; options: { id: string; text: string; ok: boolean; why: string }[] };
}

export const newsBlocks: NewsBlock[] = [
  { id: 'n1', kind: 'title', text: '運動会で3班が大かつやく!', problem: false },
  {
    id: 'n2',
    kind: 'photo',
    text: 'ゴールの{瞬間|しゅんかん}!',
    art: '🏃‍♀️🏃🏃‍♂️',
    caption: '写真:運動会のリレー(写っている人:リク、マコ、ユイ)',
    problem: true,
    fix: {
      question: 'この写真、どうする?',
      options: [
        {
          id: 'ask',
          text: '写っている人に聞いて、OKの人だけが写った写真にかえる',
          ok: true,
          why: '写真をのせるときは、写っている人の{許可|きょか}が必要。マコは「のせないで」と言っていたね。',
        },
        {
          id: 'small',
          text: '顔を小さくすれば、そのままのせていい',
          ok: false,
          why: '小さくしても、だれかはわかってしまう。本人がいやがっている写真はのせないよ。',
        },
      ],
    },
  },
  {
    id: 'n3',
    kind: 'image',
    text: '3班のチーム名は「スターレンジャー」!',
    art: '🦸⭐',
    caption: '画像:アニメ「スターレンジャー」のキャラクター(ネットで見つけた画像)',
    problem: true,
    fix: {
      question: 'このキャラクターの画像、どうする?',
      options: [
        {
          id: 'draw',
          text: '自分たちでかいたイラストにかえる',
          ok: true,
          why: 'アニメのキャラクターの絵には、作った人の{権利|けんり}(著作権)がある。自分でかけば安心だね。',
        },
        {
          id: 'credit',
          text: '画像の下に「ネットから」と書けばOK',
          ok: false,
          why: '「ネットから」と書いても、作った人の許可をもらったことにはならないよ。',
        },
      ],
    },
  },
  {
    id: 'n4',
    kind: 'text',
    text: 'リレーのアンカーは、ひかり町3丁目に住む 山田リクくん!',
    problem: true,
    fix: {
      question: 'この文、どうする?',
      options: [
        {
          id: 'trim',
          text: '「アンカーのリクくん」にして、名字と住所は消す',
          ok: true,
          why: '名前と住所がそろうと、だれがどこに住んでいるかわかってしまう。ネットに出すときは気をつけよう。',
        },
        {
          id: 'keep',
          text: 'ほめているから、そのままでいい',
          ok: false,
          why: 'ほめる内容でも、名前と住所がネットに出ると、知らない人に知られてしまうよ。',
        },
      ],
    },
  },
  {
    id: 'n5',
    kind: 'image',
    text: 'ユイがかいてくれた、3班のマーク',
    art: '🖍️🐟',
    caption: 'イラスト:ユイ(「新聞にのせてOK」と言っている)',
    problem: false,
  },
  {
    id: 'n6',
    kind: 'quote',
    text: '「速く走るコツは、うでを大きくふること」(体育の教科書より)',
    problem: false,
  },
];

export const chapter4: Chapter = {
  no: 4,
  title: 'ひかりっ子タイムズ',
  theme: '{著作物|ちょさくぶつ}と写真の公開',
  fragment: 'め',
  apps: ['chat', 'browser', 'notes', 'ai', 'library', 'news', 'album', 'settings'],
  history: [
    log('class', 'mako', '運動会の写真、わたしが写ってるのは、はずかしいからネットにはのせないでほしいな…', '3日前 17:40'),
    log('class', 'yui', 'わかった!新聞係に伝えておくね', '3日前 17:42'),
  ],
  stages: [
    {
      objective: '学級新聞アプリで、公開する前に直したほうがいいところを見つけよう',
      onEnter: [
        msg(
          'class',
          'sensei',
          '明日、学級新聞「ひかりっ子タイムズ」を学校のホームページで公開します。公開前のチェック係は%name%さんにお願いするね。',
          { wait: 1200, link: { label: '学級新聞を開く', app: 'news' } },
        ),
        msg('mirror', 'mirror', 'ネットに公開したものは、世界中のだれでも見られる。', { wait: 2000 }),
        msg(
          'mirror',
          'mirror',
          'こまる人や、悲しむ人がいないかな?アルバムやクラスのチャットも見ながら、気になるところをタップしてチェックしよう。',
          { wait: 1800 },
        ),
      ],
      doneWhen: (s) => !!s.flags['ch4:found'],
    },
    {
      objective: '見つけたところを、どう直すか決めよう(学級新聞アプリ)',
      onEnter: [msg('mirror', 'mirror', 'よく見つけたね。次は、どう直せばいいか決めよう。', { wait: 1200 })],
      doneWhen: (s) => !!s.flags['ch4:fixed'],
    },
  ],
  choices: {},
  reflection: {
    points: [
      '絵や写真、文章には作った人がいて、作った人の権利(著作権)がある',
      'ほかの人の作品を使うときは許可をもらう。自分で作るのも一つの方法',
      '人が写った写真をのせるときは、写っている人の許可をもらう',
      '名前と住所など、組み合わせるとだれかわかる情報はのせない',
    ],
    source: '文部科学省 動画教材⑱「著作物の公開」、実践授業例「写真を勝手にとってよいのかな」',
    choiceIds: [],
  },
};
