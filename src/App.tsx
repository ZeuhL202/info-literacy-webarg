import { useEffect, useState } from 'react';
import { ENDED } from './game/engine';
import { GameProvider, useGame } from './game/store';
import { EndScreen } from './ui/EndScreen';
import { Tablet } from './ui/Tablet';
import { TeacherPage } from './ui/TeacherPage';
import { TitleScreen } from './ui/TitleScreen';

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

function Game() {
  const { state } = useGame();
  if (state.chapter === 0) return <TitleScreen />;
  if (state.chapter >= ENDED) return <EndScreen />;
  return <Tablet />;
}

export default function App() {
  const hash = useHash();
  if (hash === '#/teacher') return <TeacherPage />;
  return (
    <GameProvider>
      <div className="stage">
        <Game />
      </div>
    </GameProvider>
  );
}
