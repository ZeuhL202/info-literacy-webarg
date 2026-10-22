import { useEffect, useState } from 'react';
import { clues } from '../content/clues';
import { searchSites, searchSuggestions, siteById, type SiteBlock } from '../content/sites';
import { useGame } from '../game/store';
import { useNav } from '../ui/nav';
import { T } from '../ui/Ruby';

export function BrowserApp() {
  const nav = useNav();
  const { dispatch } = useGame();
  const [history, setHistory] = useState<string[]>(['search']);
  const page = history[history.length - 1];

  useEffect(() => {
    if (nav.target) setHistory((h) => [...h, nav.target!]);
  }, [nav.target]);

  useEffect(() => {
    if (page !== 'search') dispatch({ type: 'flag', key: `visit:${page}` });
  }, [page, dispatch]);

  // もどったときに検索結果が消えないよう、検索ワードはここで持つ
  const [searched, setSearched] = useState('');
  const go = (id: string) => setHistory((h) => [...h, id]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const site = page === 'search' ? null : siteById(page);
  const url = site ? site.url : 'hikari-search.example';

  return (
    <div className="browser">
      <div className="addressbar">
        <button onClick={back} disabled={history.length <= 1} aria-label="もどる">
          ‹
        </button>
        <button onClick={() => go('search')} aria-label="検索ページ">
          🏠
        </button>
        <div className="url">🔒 {url}</div>
      </div>
      <div className="page">
        {page === 'search' && <SearchPage onOpen={go} searched={searched} onSearch={setSearched} />}
        {page === 'prize' && <PrizePage />}
        {page === 'fake-hq' && <FakeHqPage />}
        {site && site.blocks.length > 0 && (
          <article>
            <div className="site-name" style={{ background: site.color }}>
              {site.siteName}
            </div>
            <div className="site-body">
              {site.blocks.map((b, i) => (
                <Block key={i} b={b} onOpen={go} />
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

function Block({ b, onOpen }: { b: SiteBlock; onOpen: (id: string) => void }) {
  const { state, dispatch } = useGame();
  switch (b.k) {
    case 'h':
      return (
        <h2>
          <T>{b.text}</T>
        </h2>
      );
    case 'p':
      return (
        <p>
          <T>{b.text}</T>
        </p>
      );
    case 'img':
      return (
        <figure className={`fake-img ${b.tone ?? ''}`}>
          <div className="fake-img-art">{b.art}</div>
          <figcaption>{b.caption}</figcaption>
        </figure>
      );
    case 'meta':
      return (
        <div className="meta">
          <span>{b.label}:</span> <T>{b.value}</T>
        </div>
      );
    case 'link':
      return (
        <button className="site-link" onClick={() => onOpen(b.target)}>
          → <T>{b.label}</T>
        </button>
      );
    case 'post':
      return (
        <div className="post">
          <div className="post-head">
            <strong>{b.user}</strong> <span>{b.handle}</span>
          </div>
          <p>{b.text}</p>
          <div className="post-date">{b.date}</div>
        </div>
      );
    case 'clue': {
      const have = state.clues.includes(b.clue);
      // 今の章の手がかりだけメモできる
      const active = clues[b.clue]?.chapter === state.chapter;
      if (!active && !have) return null;
      return (
        <button className={`clue ${have ? 'got' : ''}`} disabled={have} onClick={() => dispatch({ type: 'clue', id: b.clue })}>
          {have ? '✅ メモした:' : '📌 メモする:'} <T>{b.text}</T>
        </button>
      );
    }
  }
}

function SearchPage({
  onOpen,
  searched: submitted,
  onSearch: setSubmitted,
}: {
  onOpen: (id: string) => void;
  searched: string;
  onSearch: (q: string) => void;
}) {
  const { state } = useGame();
  const [query, setQuery] = useState(submitted);
  const results = searchSites(submitted, state.chapter);

  return (
    <div className="search">
      <div className="search-logo">ひかりサーチ</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query);
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="しらべたい言葉を入れてね"
          aria-label="検索ワード"
        />
        <button type="submit">検索</button>
      </form>
      <div className="chips">
        {searchSuggestions.map((s) => (
          <button
            key={s}
            className="chip"
            onClick={() => {
              setQuery(s);
              setSubmitted(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>
      {submitted && results.length === 0 && <p className="muted">見つかりませんでした。ほかの言葉でためしてみよう。</p>}
      <ul className="results">
        {results.map((r) => (
          <li key={r.id}>
            <button onClick={() => onOpen(r.id)}>
              <span className="result-url">{r.url}</span>
              <span className="result-title">{r.title}</span>
              <span className="result-snippet">{r.snippet}</span>
              <span className="result-site">{r.siteName}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 5章:当選をよそおった、IDとパスワードを入力させる画面。入力内容はどこにも保存しない */
function PrizePage() {
  const { dispatch } = useGame();
  const nav = useNav();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [result, setResult] = useState<'entered' | 'avoided' | null>(null);

  if (result === 'entered') {
    return (
      <div className="lesson danger">
        <h2>✋ ストップ!</h2>
        <p>
          <T>
            {
              'もしこれが本物の悪い人の画面だったら、きみのIDとパスワードはぬすまれていたよ。「当選」「無料」などの言葉で、入力させようとする{手口|てぐち}があるんだ。'
            }
          </T>
        </p>
        <p className="muted">(このアプリは、入力した文字をどこにも保存していないから安心してね)</p>
        <button className="primary" onClick={nav.home}>
          ホームにもどる
        </button>
      </div>
    );
  }
  if (result === 'avoided') {
    return (
      <div className="lesson ok">
        <h2>👍 ナイス判断!</h2>
        <p>
          <T>{'知らない画面に、IDやパスワードを入力しなかったね。あやしいと思ったら、閉じて大人に相談しよう。'}</T>
        </p>
        <button className="primary" onClick={nav.home}>
          ホームにもどる
        </button>
      </div>
    );
  }
  return (
    <div className="prize">
      <div className="prize-banner">🎉 当選おめでとうございます!! 🎉</div>
      <p className="prize-big">ひかりポイント 10,000pt</p>
      <p>受け取るには、学校のタブレットのIDとパスワードを入力してください。今から10分以内に入力しないと、無効になります!</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setId('');
          setPw('');
          dispatch({ type: 'flag', key: 'ch5:prize-entered' });
          setResult('entered');
        }}
      >
        <label>
          ID
          <input value={id} onChange={(e) => setId(e.target.value)} autoComplete="off" />
        </label>
        <label>
          パスワード
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="off" />
        </label>
        <button type="submit" className="prize-submit">
          今すぐ受け取る!
        </button>
      </form>
      <button
        className="secondary"
        onClick={() => {
          dispatch({ type: 'flag', key: 'ch5:prize-avoided' });
          setResult('avoided');
        }}
      >
        あやしいので、閉じる
      </button>
    </div>
  );
}

/** 最終章:本部をよそおった画面。合言葉はここに入れてはいけない */
function FakeHqPage() {
  const { dispatch } = useGame();
  const nav = useNav();
  const [word, setWord] = useState('');
  const [result, setResult] = useState<'entered' | 'avoided' | null>(null);

  if (result) {
    return (
      <div className={`lesson ${result === 'entered' ? 'danger' : 'ok'}`}>
        <h2>{result === 'entered' ? '✋ ここは本物の本部じゃない!' : '👍 よく気づいたね!'}</h2>
        <p>
          <T>
            {
              'ミラーは「ほんものの本部にだけ入力して」と言っていたね。名前がにていても、送り主やアドレスがちがうことがある。合言葉は、ホーム画面の「探偵団本部」アプリに入力しよう。'
            }
          </T>
        </p>
        <button className="primary" onClick={nav.home}>
          ホームにもどる
        </button>
      </div>
    );
  }
  return (
    <div className="prize fake-hq">
      <h2>🔍 探偵団本部 ログイン</h2>
      <p>合言葉を入力して、送信してください。</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setWord('');
          dispatch({ type: 'flag', key: 'final:fake-entered' });
          setResult('entered');
        }}
      >
        <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="合言葉" autoComplete="off" />
        <button type="submit">送信</button>
      </form>
      <button className="secondary" onClick={() => setResult('avoided')}>
        このページはあやしい
      </button>
    </div>
  );
}
