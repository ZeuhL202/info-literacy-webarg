/** 📌メモできる手がかり */
export const clues: Record<string, { chapter: number; text: string }> = {
  'c1-anon': { chapter: 1, text: 'まとめ記事には、書いた人の名前がどこにもない' },
  'c1-fake': { chapter: 1, text: 'もとの投稿をした人が「{合成|ごうせい}してみた」と書いている' },
  'c1-copy': { chapter: 1, text: 'ほかのサイトも、同じまとめ記事をコピーしているだけ' },
  'c1-news': { chapter: 1, text: 'ひかり新聞は「秋まつりのバルーン」と伝えている' },
  'c1-official': { chapter: 1, text: '町役場が「怪獣が出たという情報は事実ではない」と発表' },
  'c5-birthday': { chapter: 5, text: 'パスワードが、たんじょうびで当てられやすかった' },
  'c5-told': { chapter: 5, text: 'ゲームのフレンドに、チャットでパスワードを教えていた' },
  'c5-prize': { chapter: 5, text: '「当選」の画面に、IDとパスワードを入力していた' },
};
