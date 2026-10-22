import { useState } from 'react';
import { useGame } from '../game/store';
import { T } from './Ruby';

export function TitleScreen() {
  const { dispatch } = useGame();
  const [name, setName] = useState('');
  const trimmed = name.trim();

  return (
    <div className="title-screen">
      <div className="title-logo">🪞</div>
      <h1>
        ひかり町
        <br />
        デジタル探偵団
      </h1>
      <p className="title-lead">
        <T>{'きみは、ひかり小学校に{転校|てんこう}してきた5年生。学校でかりたタブレットに、なぞのメッセージがとどいて…。'}</T>
      </p>
      <form
        className="title-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) dispatch({ type: 'start', nickname: trimmed.slice(0, 10) });
        }}
      >
        <label htmlFor="nickname">ニックネームを決めよう</label>
        <input
          id="nickname"
          value={name}
          maxLength={10}
          onChange={(e) => setName(e.target.value)}
          placeholder="れい:ひかりん"
          autoComplete="off"
        />
        <p className="title-note">
          <T>{'⚠️ 本当の名前は入れないでね。ネットでは、ニックネームを使うのが安心だよ。'}</T>
        </p>
        <button className="primary big" type="submit" disabled={!trimmed}>
          はじめる
        </button>
      </form>
      <p className="title-small">この物語に出てくる町・人・サイトは、すべてつくりものです。</p>
    </div>
  );
}
