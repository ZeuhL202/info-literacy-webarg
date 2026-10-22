// ビルド結果(dist)を1つのHTMLにまとめ、パスワードで暗号化して dist-protected に出力する。
// GitHub Pages は誰でも見られる静的サイトなので、中身そのものを暗号化して、
// パスワードを知っている人だけがブラウザ内で復号して遊べるようにする。
//
// 使い方: SITE_PASSWORD=xxxx node scripts/protect.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto as crypto } from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const outDir = join(root, 'dist-protected');
const ITERATIONS = 310000;

const password = process.env.SITE_PASSWORD ?? '';
if (password.length < 8) {
  console.error('SITE_PASSWORD を8文字以上で設定してください。');
  process.exit(1);
}

// 1. CSS と JS を index.html に埋めこんで、1ファイルにする
let html = await readFile(join(distDir, 'index.html'), 'utf8');

const cssLinks = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
for (const [tag, href] of cssLinks) {
  const css = await readFile(join(distDir, href), 'utf8');
  html = html.replace(tag, () => `<style>${css}</style>`);
}

const scripts = [...html.matchAll(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g)];
for (const [tag, src] of scripts) {
  const js = (await readFile(join(distDir, src), 'utf8')).replace(/<\/script/gi, '<\\/script');
  // 本体は </body> の直前で実行する(document.write で書き出したときに #root があるように)
  html = html.replace(tag, '');
  html = html.replace('</body>', () => `<script type="module">${js}</script>\n</body>`);
}

if (/src="\.\/assets\//.test(html) || /href="\.\/assets\//.test(html)) {
  console.error('埋めこめなかったファイルがあります。dist/index.html を確認してください。');
  process.exit(1);
}

// 2. パスワードから鍵を作って AES-GCM で暗号化する
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(html)));
const b64 = (u8) => Buffer.from(u8).toString('base64');

// 3. パスワード入力画面を作る
const gate = `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>ひかり町デジタル探偵団</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪞</text></svg>" />
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #e9eef7; font-family: 'Hiragino Maru Gothic ProN', 'BIZ UDPGothic', 'Noto Sans JP', sans-serif; color: #1f2430; padding: 16px; box-sizing: border-box; }
  form { background: #fff; border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 360px; text-align: center;
    box-shadow: 0 16px 32px rgba(40, 30, 120, 0.15); }
  h1 { font-size: 1.3em; margin: 8px 0 4px; }
  p { margin: 0 0 16px; color: #6b7280; font-size: 0.9em; }
  input { width: 100%; box-sizing: border-box; padding: 10px 14px; border-radius: 12px; border: 2px solid #d9dee8; font-size: 1.05em; }
  button { margin-top: 14px; background: #5b4bd6; color: #fff; border: none; border-radius: 999px; padding: 10px 28px; font-size: 1em; font-weight: bold; cursor: pointer; }
  button:disabled { background: #b9b3e8; }
  .err { color: #c0392b; min-height: 1.5em; margin: 10px 0 0; font-size: 0.9em; }
</style>
</head>
<body>
<form id="gate">
  <div style="font-size:48px">🪞</div>
  <h1>ひかり町デジタル探偵団</h1>
  <p>先生から教えてもらったパスワードを入れてね</p>
  <input id="pw" type="password" autocomplete="current-password" aria-label="パスワード" autofocus />
  <button id="go" type="submit">ひらく</button>
  <div class="err" id="err" role="alert"></div>
</form>
<script>
(function () {
  var SALT = '${b64(salt)}';
  var IV = '${b64(iv)}';
  var DATA = '${b64(cipher)}';
  var ITER = ${ITERATIONS};
  var KEY = 'hikari-arg-pass';
  function bytes(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  async function unlock(pw) {
    var e = new TextEncoder();
    var base = await crypto.subtle.importKey('raw', e.encode(pw), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(SALT), iterations: ITER, hash: 'SHA-256' },
      base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(IV) }, key, bytes(DATA));
    return new TextDecoder().decode(plain);
  }
  function show(html) { document.open(); document.write(html); document.close(); }
  var form = document.getElementById('gate'), input = document.getElementById('pw'),
      btn = document.getElementById('go'), err = document.getElementById('err');
  if (!window.crypto || !crypto.subtle) { err.textContent = 'このブラウザでは開けません。新しいブラウザで開いてください。'; btn.disabled = true; return; }
  var saved = null;
  try { saved = sessionStorage.getItem(KEY); } catch (e) {}
  if (saved) unlock(saved).then(show, function () { try { sessionStorage.removeItem(KEY); } catch (e) {} });
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var pw = input.value;
    if (!pw) return;
    btn.disabled = true; err.textContent = 'たしかめています…';
    unlock(pw).then(function (html) {
      try { sessionStorage.setItem(KEY, pw); } catch (e) {}
      show(html);
    }, function () {
      btn.disabled = false; err.textContent = 'パスワードがちがうみたい。もう一度入れてね。'; input.select();
    });
  });
})();
</script>
</body>
</html>
`;

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, 'index.html'), gate);
await writeFile(join(outDir, '.nojekyll'), '');
await writeFile(join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`dist-protected/index.html を作成しました(${Math.round(gate.length / 1024)} KB)`);
