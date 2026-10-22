import { T } from '../ui/Ruby';

const photos = [
  { id: 'p1', art: '🏃‍♀️🏃🏃‍♂️', title: '運動会のリレー', who: 'リク、マコ、ユイ', note: 'マコ:「ネットにはのせないでほしい」' },
  { id: 'p2', art: '🏃‍♀️🏁', title: 'ゴールテープ', who: 'ユイ(OKと言っている)', note: '' },
  { id: 'p3', art: '🎈🐉🎈', title: '秋まつりのバルーン', who: '人は写っていない', note: '' },
  { id: 'p4', art: '🦐🌿', title: 'ひかり池のザリガニ', who: '人は写っていない', note: '3班の自由研究用' },
];

export function AlbumApp() {
  return (
    <div className="album">
      <p className="muted">クラスで共有しているアルバムだよ。</p>
      <div className="album-grid">
        {photos.map((p) => (
          <figure key={p.id} className="album-item">
            <div className="fake-img-art">{p.art}</div>
            <figcaption>
              <strong>{p.title}</strong>
              <br />
              写っている人:{p.who}
              {p.note && (
                <>
                  <br />
                  <span className="album-note">
                    <T>{p.note}</T>
                  </span>
                </>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
