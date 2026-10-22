export type SiteBlock =
  | { k: 'h'; text: string }
  | { k: 'p'; text: string }
  | { k: 'img'; art: string; caption: string; tone?: 'fake' | 'photo' }
  | { k: 'meta'; label: string; value: string }
  | { k: 'clue'; text: string; clue: string }
  | { k: 'link'; label: string; target: string }
  | { k: 'post'; user: string; handle: string; text: string; date: string };

export interface SitePage {
  id: string;
  url: string;
  siteName: string;
  title: string;
  /** この章から検索で見つかる */
  chapter: number;
  keywords: string[];
  snippet: string;
  color: string;
  blocks: SiteBlock[];
}

export const sites: SitePage[] = [
  {
    id: 'matome',
    url: 'matome-sokuhou.example/kaiju',
    siteName: 'まとめ速報ドットネット',
    title: '【衝撃】ひかり池に巨大怪獣あらわる!!',
    chapter: 1,
    keywords: ['怪獣', 'かいじゅう', 'ひかり池', '池', 'まとめ'],
    snippet: 'SNSで話題!ひかり池に、なぞの巨大な生き物が…!目撃者多数!',
    color: '#d93025',
    blocks: [
      { k: 'h', text: '【{衝撃|しょうげき}】ひかり池に{巨大|きょだい}怪獣あらわる!!' },
      { k: 'img', art: '🦖🌊', caption: '※画像はSNSより', tone: 'fake' },
      { k: 'p', text: 'SNSで話題になっている写真がこちら!ひかり池に、なぞの巨大な生き物があらわれたらしい!!' },
      { k: 'p', text: '目撃者多数!?近くに住む人は、気をつけて!!' },
      { k: 'p', text: '(画像の下に「SNSより」とある。もとの投稿はどこだろう?)' },
      { k: 'link', label: 'もとの投稿(つぶやきタウン)を見る', target: 'sns' },
      { k: 'meta', label: '書いた人', value: '(書かれていない)' },
      { k: 'clue', text: 'このまとめ記事には、書いた人の名前がどこにもない', clue: 'c1-anon' },
    ],
  },
  {
    id: 'sns',
    url: 'tsubuyaki-town.example/kaiju_fan/1029',
    siteName: 'つぶやきタウン',
    title: '@kaiju_fan の投稿',
    chapter: 1,
    keywords: ['kaiju_fan', 'つぶやき', '投稿', '合成'],
    snippet: 'ひかり池の写真に、怪獣を合成してみたw',
    color: '#1d9bf0',
    blocks: [
      {
        k: 'post',
        user: '怪獣ファン',
        handle: '@kaiju_fan',
        text: 'ひかり池の写真に、怪獣を合成してみたw よくできてるでしょ? #合成 #ネタ',
        date: '10月19日 20:14',
      },
      { k: 'img', art: '🦖🌊', caption: '(投稿された画像)', tone: 'fake' },
      { k: 'clue', text: 'もとの投稿をした人が「合成してみた」と書いている', clue: 'c1-fake' },
    ],
  },
  {
    id: 'copy1',
    url: 'omoshiro-news.example/2026/kaiju',
    siteName: 'おもしろニュース速報',
    title: 'ひかり池に怪獣!?ネットで話題に',
    chapter: 1,
    keywords: ['怪獣', 'かいじゅう', 'ひかり池', '池', 'ニュース'],
    snippet: 'まとめ速報ドットネットによると、ひかり池に怪獣が…',
    color: '#f29900',
    blocks: [
      { k: 'h', text: 'ひかり池に怪獣!?ネットで話題に' },
      { k: 'img', art: '🦖🌊', caption: '画像:まとめ速報ドットネットより', tone: 'fake' },
      { k: 'p', text: 'まとめ速報ドットネットによると、ひかり池に怪獣があらわれたらしい。くわしいことはわかっていない。' },
      { k: 'link', label: 'まとめ速報ドットネットの記事', target: 'matome' },
      { k: 'clue', text: 'ほかのサイトも、同じまとめ記事をコピーしているだけ', clue: 'c1-copy' },
    ],
  },
  {
    id: 'copy2',
    url: 'wadai-matome.example/entry/88',
    siteName: '話題まとめちゃんねる',
    title: '【画像あり】ひかり池の怪獣がやばいと話題',
    chapter: 1,
    keywords: ['怪獣', 'かいじゅう', 'ひかり池', '池', '画像'],
    snippet: '【画像あり】例の怪獣の画像、まとめ速報から持ってきた',
    color: '#7cb342',
    blocks: [
      { k: 'h', text: '【画像あり】ひかり池の怪獣がやばいと話題' },
      { k: 'img', art: '🦖🌊', caption: '画像:まとめ速報ドットネットより', tone: 'fake' },
      { k: 'p', text: '例の怪獣の画像、まとめ速報から持ってきた。こわすぎ!' },
      { k: 'clue', text: 'ほかのサイトも、同じまとめ記事をコピーしているだけ', clue: 'c1-copy' },
    ],
  },
  {
    id: 'news',
    url: 'hikari-shimbun.example/local/20261020',
    siteName: 'ひかり新聞',
    title: 'ひかり池で秋まつりの準備 巨大バルーンが登場',
    chapter: 1,
    keywords: ['怪獣', 'かいじゅう', 'ひかり池', '池', 'まつり', '祭り', 'バルーン', '新聞'],
    snippet: 'ひかり池で、秋まつりに向けた巨大バルーンのテストが行われた。',
    color: '#1a4d8f',
    blocks: [
      { k: 'h', text: 'ひかり池で秋まつりの準備 巨大バルーンが登場' },
      { k: 'meta', label: '記事', value: 'ひかり新聞 {地域|ちいき}ニュース(10月20日)' },
      { k: 'img', art: '🎈🐉🎈', caption: '池のほとりでテストされた、竜の形のバルーン', tone: 'photo' },
      {
        k: 'p',
        text: '20日、ひかり池で、11月の秋まつりに向けて、竜の形をした巨大バルーンのテストが行われた。',
      },
      {
        k: 'p',
        text: 'SNSでは「怪獣が出た」という投稿も広がっているが、実行委員会は「まつりのバルーンです。安心してください」と話している。',
      },
      { k: 'clue', text: 'ひかり新聞は「秋まつりのバルーン」と伝えている', clue: 'c1-news' },
    ],
  },
  {
    id: 'town',
    url: 'town.hikari.example/news/1021',
    siteName: 'ひかり町役場(公式)',
    title: 'ひかり池についてのお知らせ',
    chapter: 1,
    keywords: ['怪獣', 'かいじゅう', 'ひかり池', '池', '町役場', '役場', 'お知らせ', '公式'],
    snippet: '「ひかり池に怪獣が出た」という情報は事実ではありません。',
    color: '#2f8f5b',
    blocks: [
      { k: 'h', text: 'ひかり池についてのお知らせ' },
      { k: 'meta', label: '発信', value: 'ひかり町役場 公園課(10月21日)' },
      {
        k: 'p',
        text: 'インターネット上で「ひかり池に怪獣が出た」という情報が広がっていますが、事実ではありません。',
      },
      { k: 'p', text: '池のまわりは安全です。11月の秋まつりでは、竜のバルーンがみなさんをお待ちしています。' },
      { k: 'clue', text: '町役場が「怪獣が出たという情報は事実ではない」と発表', clue: 'c1-official' },
    ],
  },
  {
    id: 'prize',
    url: 'hikari-point-present.example/win',
    siteName: 'ひかりポイント プレゼント',
    title: '🎉 当選おめでとうございます!',
    chapter: 99,
    keywords: [],
    snippet: '',
    color: '#ff2d8a',
    blocks: [],
  },
  {
    id: 'fake-hq',
    url: 'tantei-honbu.example/login',
    siteName: '探偵団本部(?)',
    title: '合言葉の入力',
    chapter: 99,
    keywords: [],
    snippet: '',
    color: '#444',
    blocks: [],
  },
];

export const siteById = (id: string) => sites.find((p) => p.id === id);

/** 検索ワードにあう、その章で見られるページを探す */
export function searchSites(query: string, chapter: number): SitePage[] {
  const q = query.trim();
  if (!q) return [];
  return sites.filter((p) => p.chapter <= chapter && p.keywords.some((k) => q.includes(k) || k.includes(q)));
}

export const searchSuggestions = ['ひかり池 怪獣', 'ひかり池 まつり', 'ひかり町役場 お知らせ'];
