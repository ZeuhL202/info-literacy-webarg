import { useState } from 'react';
import { T } from '../ui/Ruby';

const books = [
  {
    id: 'ayumi',
    title: '『ひかり町のあゆみ』',
    by: 'ひかり町{教育|きょういく}委員会 編',
    icon: '📕',
    body: [
      'ひかり町の{年表|ねんぴょう}',
      '1890年 田んぼに水を送るため、ひかり池(ため池)がつくられる',
      '1925年 ひかり川に、ひかり橋がかけられる',
      '1960年 ひかり小学校の新しい{校舎|こうしゃ}ができる',
      '1985年 ひかり駅が新しくなる',
      '2001年 ひかり池のまわりが公園になり、秋まつりが始まる',
    ],
  },
  {
    id: 'museum',
    title: '郷土資料館 パンフレット',
    by: 'ひかり町{郷土|きょうど}資料館',
    icon: '🏛️',
    body: [
      '人物コーナー:ひかり町ゆかりの人',
      '・ほしの みどり(作家)…ひかり池を{舞台|ぶたい}にした童話を書いた',
      '・あおき けん(医者)…町で初めての{診療所|しんりょうじょ}を開いた',
      'よくある質問',
      'Q.「ひかり太郎」という発明家はいますか?',
      'A. 資料館では、「ひかり太郎」という人物の記録は見つかっていません。',
    ],
  },
  {
    id: 'kids',
    title: '『こどもひかり町ずかん』',
    by: 'ひかり町図書館',
    icon: '📗',
    body: [
      'ひかり町は、北に山、南にひかり川がある、山と川にかこまれた町です。',
      '毎年11月には、ひかり池公園で秋まつりが開かれ、竜のバルーンが名物です。',
    ],
  },
];

export function LibraryApp() {
  const [open, setOpen] = useState<string | null>(null);
  const book = books.find((b) => b.id === open);

  if (book) {
    return (
      <div className="library">
        <button className="link-back" onClick={() => setOpen(null)}>
          ‹ 本だなにもどる
        </button>
        <div className="book">
          <h2>
            {book.icon} <T>{book.title}</T>
          </h2>
          <p className="muted">
            <T>{book.by}</T>
          </p>
          {book.body.map((line) => (
            <p key={line}>
              <T>{line}</T>
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="library">
      <p className="muted">ひかり町図書館の本や資料を読めるよ。</p>
      <ul className="shelf">
        {books.map((b) => (
          <li key={b.id}>
            <button onClick={() => setOpen(b.id)}>
              <span className="book-icon">{b.icon}</span>
              <span>
                <strong>
                  <T>{b.title}</T>
                </strong>
                <br />
                <span className="muted">
                  <T>{b.by}</T>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
