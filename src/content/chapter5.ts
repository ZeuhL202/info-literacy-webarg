import type { Chapter } from '../game/types';
import { choice, flag, msg, notice } from './helpers';

export const chapter5Clues = ['c5-birthday', 'c5-told', 'c5-prize'] as const;

export const chapter5: Chapter = {
  no: 5,
  title: 'のっとられたアカウント',
  theme: 'パスワードと個人情報を守る',
  fragment: 'る',
  apps: ['chat', 'browser', 'notes', 'ai', 'library', 'news', 'album', 'settings'],
  stages: [
    {
      objective: 'カイトのアカウントがのっとられた原因を3つ見つけよう(設定 → カイトのアカウントの記録)',
      onEnter: [
        msg('class', 'kaito', 'このURLから、無料でゲームのアイテムがもらえるよ!→ hikari-free-item.example', { wait: 1200 }),
        msg('class', 'kaito', 'このURLから、無料でゲームのアイテムがもらえるよ!→ hikari-free-item.example', { wait: 900 }),
        msg('class', 'yui', 'カイト、どうしたの?なんか変だよ', { wait: 1500 }),
        notice('🎉 当選のお知らせ', 'ひかりポイント10000ptが当たりました!今すぐ受け取ってね', 'browser', 'prize', 1800),
        msg(
          'sensei',
          'sensei',
          '%name%さん、カイトさんのアカウントが、だれかにのっとられたみたい。カイトさん本人は、今おうちでおこまりです。',
          { wait: 2200 },
        ),
        msg(
          'sensei',
          'sensei',
          'カイトさんとおうちの人の了解をもらって、アカウントの記録を見られるようにしました。いっしょに原因を調べてくれる?',
          { wait: 2000, link: { label: 'カイトのアカウントの記録を見る', app: 'settings', target: 'kaito-account' } },
        ),
        msg('mirror', 'mirror', '最後の「ゆがみ」だ。あやしい通知にも気をつけて。', { wait: 2000 }),
      ],
      doneWhen: (s) => chapter5Clues.every((c) => s.clues.includes(c)),
    },
    {
      objective: '森先生に、これからどうすればいいか伝えよう(チャット → 森先生)',
      onEnter: [
        msg('sensei', 'sensei', '原因がはっきりしたね。ありがとう。', { wait: 1200 }),
        msg('sensei', 'sensei', 'カイトさんは、これから何をしたらいいと思う?', { wait: 1500 }),
        choice('sensei', 'ch5-what', 600),
      ],
      doneWhen: (s) => !!s.flags['choice:ch5-what'],
    },
  ],
  choices: {
    'ch5-what': {
      id: 'ch5-what',
      options: [
        {
          id: 'hide',
          text: '新しいアカウントを作って、だまっておく',
          replies: [
            msg(
              'sensei',
              'sensei',
              'だまっていると、のっとられたアカウントから、友だちにあやしいメッセージが送られ続けてしまうよ。もう一度考えてみて。',
              { wait: 2000 },
            ),
          ],
        },
        {
          id: 'reply',
          text: 'のっとった人に「やめて」とメッセージを送る',
          replies: [
            msg(
              'sensei',
              'sensei',
              '知らない相手とやりとりすると、もっと情報を聞き出されることがあるの。自分たちだけで{解決|かいけつ}しようとしないでね。もう一度考えてみて。',
              { wait: 2200 },
            ),
          ],
        },
        {
          id: 'consult',
          text: 'おうちの人と先生に相談して、パスワードを変える。新しいパスワードはだれにも教えない',
          best: true,
          replies: [
            msg('sensei', 'sensei', 'そのとおり!すぐに大人に相談するのがいちばん大事。', { wait: 1500 }),
            msg(
              'sensei',
              'sensei',
              '新しいパスワードは、たんじょうびや名前など、当てられやすいものはさけようね。友だちにも教えないこと。',
              { wait: 2000 },
            ),
            msg(
              'class',
              'kaito',
              '(カイトです。お母さんのスマホから)みんな、変なメッセージ送ってごめん!のっとられてた。URLは開かないで!',
              { wait: 2200 },
            ),
          ],
        },
      ],
    },
  },
  reflection: {
    points: [
      'パスワードは、友だちにも教えない',
      'たんじょうびや名前など、当てられやすいパスワードにしない',
      '「当選」などの知らない画面に、IDやパスワードを入力しない',
      'おかしいと思ったら、すぐにおうちの人や先生に相談する',
    ],
    source: '文部科学省 動画教材⑲「学習用タブレットの上手な使い方」',
    choiceIds: ['ch5-what'],
  },
};

/** 最終章。かけらをならべて合言葉を本部に入力する */
export const finale: Chapter = {
  no: 6,
  title: 'ミラーの正体',
  theme: '最終章',
  fragment: '',
  apps: ['chat', 'browser', 'notes', 'ai', 'library', 'news', 'album', 'settings', 'hq'],
  stages: [
    {
      objective: '「探偵団本部」アプリで、かけらをならべて合言葉を入力しよう',
      onEnter: [
        msg('mirror', 'mirror', '5つのかけらが、そろったね。', { wait: 1500 }),
        msg(
          'mirror',
          'mirror',
          'かけらをならべかえて、合言葉を「探偵団本部」アプリに入力してほしい。ホーム画面に、新しいアプリがとどいているはずだ。',
          { wait: 2000 },
        ),
        msg(
          'mirror',
          'mirror',
          'ひとつだけ注意。合言葉は、ほんものの本部にだけ入力すること。ほかの画面にはぜったいに入れないで。',
          { wait: 2000 },
        ),
        notice('【探偵団本部】合言葉の入力', '合言葉をこちらから送信してください', 'browser', 'fake-hq', 3500),
      ],
      doneWhen: (s) => !!s.flags['final:solved'],
    },
    {
      objective: 'ミラーの話を聞こう(チャット → ミラー)',
      onEnter: [
        msg('mirror', 'mirror', '…合言葉、たしかに受け取ったよ。', { wait: 1500 }),
        msg(
          'mirror',
          'mirror',
          'ぼくは、この町のネットを見守るために作られたプログラム。ゆがみを作っていたんじゃない。町のみんなの、ちょっとした「うっかり」を{映|うつ}していただけなんだ。',
          { wait: 2500 },
        ),
        msg('mirror', 'mirror', 'でも、ゆがみを直したのは、ぼくじゃない。%name%、きみだよ。', { wait: 2500 }),
        msg('mirror', 'mirror', 'これからも、「たしかめる」人でいてね。', { wait: 2200 }),
        flag('final:end', 5000),
      ],
      doneWhen: (s) => !!s.flags['final:end'],
    },
  ],
  choices: {},
  reflection: { points: [], source: '', choiceIds: [] },
};
