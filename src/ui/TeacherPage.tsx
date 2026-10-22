import { chapters } from '../content/chapters';
import { plain } from './Ruby';

const lessonNotes: Record<number, { aim: string; questions: string[] }> = {
  1: {
    aim: 'ネット上の情報には、意図的なうそや勘違いによる誤情報があることに気づき、3つの観点で確かめる習慣をつける。',
    questions: [
      '主人公は、ソラから記事が届いたときにどうすればよかったか',
      '3つの観点のうち、ふだんの調べ学習ですぐに使えるのはどれか',
    ],
  },
  2: {
    aim: '文字だけのやりとりは誤解が生まれやすく、だれもが加害者にも被害者にもなりうることに気づく。',
    questions: [
      '「それでいいんじゃない」は、どんな気持ちで読まれる可能性があるか',
      'グループチャットで誤解が起きたとき、自分ならどうするか',
    ],
  },
  3: {
    aim: '生成AIの答えには誤りが含まれることを知り、信頼できる資料で確かめ、自分の考えを深めるために使う態度を育てる。',
    questions: [
      'AIの答えを全部信じてよいか。どうすれば確かめられるか',
      'AIを使うと学びが深まる場面と、学びにならない場面のちがいは何か',
    ],
  },
  4: {
    aim: '身の回りの作品には作った人の権利があり、人の写真や名前を公開するには配慮と許可が必要だと理解する。',
    questions: ['ネットで見つけた画像を使いたいとき、どうすればよいか', '写真をのせるとき、だれに何を確かめるか'],
  },
  5: {
    aim: 'パスワードの管理や、偽の当選画面などの手口を知り、困ったときはすぐに大人に相談できるようにする。',
    questions: ['カイトのアカウントがのっとられた原因は何だったか', '自分のパスワードを守るために、今日からできることは何か'],
  },
};

export function TeacherPage() {
  return (
    <div className="teacher">
      <h1>ひかり町デジタル探偵団 先生・保護者向けガイド</h1>
      <p>
        文部科学省「情報モラル教育ポータルサイト」の動画教材と実践授業例をもとに、小学4〜5年生が情報モラルを物語の中で体験できるようにしたARG(代替現実ゲーム)です。1章あたり10〜15分を想定しています。
      </p>
      <h2>使い方</h2>
      <ul>
        <li>各章の最後に「ふりかえりカード」が出ます。授業では、カードを見ながら下の問いで話し合うと効果的です。</li>
        <li>
          進みぐあいはその端末のブラウザ内だけに保存され、外部には送信されません。ニックネーム以外の個人情報は入力させないでください。
        </li>
        <li>
          5章の「当選画面」と最終章の「にせの本部画面」は、入力しないことを学ぶための演出です。入力された文字は保存しません。
        </li>
        <li>20分続けて遊ぶと、目を休めるメッセージが出ます。</li>
      </ul>
      <h2>章ごとのねらい</h2>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>章</th>
            <th>題材</th>
            <th>ねらい</th>
            <th>話し合いの問い</th>
            <th>もとにした教材</th>
          </tr>
        </thead>
        <tbody>
          {chapters
            .filter((c) => c.no <= 5)
            .map((c) => (
              <tr key={c.no}>
                <td>{c.no}</td>
                <td>
                  {plain(c.title)}
                  <br />
                  <small>{plain(c.theme)}</small>
                </td>
                <td>{lessonNotes[c.no].aim}</td>
                <td>
                  <ul>
                    {lessonNotes[c.no].questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </td>
                <td>{c.reflection.source}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h2>参考</h2>
      <ul>
        <li>
          <a href="https://www.mext.go.jp/zyoukatsu/moral/" target="_blank" rel="noreferrer">
            文部科学省 情報モラル教育ポータルサイト
          </a>
        </li>
        <li>
          <a href="https://www.mext.go.jp/a_menu/shotou/zyouhou/detail/1416322.htm" target="_blank" rel="noreferrer">
            文部科学省 動画教材等(令和元年度以降)
          </a>
        </li>
      </ul>
      <p>
        <a href="#/">ゲームにもどる</a>
      </p>
    </div>
  );
}
