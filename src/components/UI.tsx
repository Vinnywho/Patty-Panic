import { useGameStore } from '../store/gameStore';
import { useMemo } from 'react';

const VICTORY_PHRASES = [
  { title: '💅 Fabulosa!', subtitle: 'Você arrasou na passarela, querida!' },
  { title: '👑 Rainha do VIP!', subtitle: 'Ninguém segura essa diva!' },
  { title: '✨ Icônica!', subtitle: 'A área VIP nunca viu tanta elegância!' },
  { title: '💖 Slayyyy!', subtitle: 'As rivais ficaram comendo poeira de glitter!' },
  { title: '🏆 Lacrou!', subtitle: 'Primeira da fila, como sempre!' },
  { title: '💎 Impecável!', subtitle: 'Até os obstáculos se curvaram pra você!' },
  { title: '🌟 OMG!', subtitle: 'Essa corrida foi mais épica que liquidação de grife!' },
  { title: '🎀 Divíssima!', subtitle: 'Chegou, viu e conquistou o VIP!' },
];

export const UI = () => {
  const { status, setStatus, resetGame, togglePause } = useGameStore();

  const phrase = useMemo(() => {
    return VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)];
  }, [status]);

  const handleStartGame = () => {
    setStatus('playing');
    // Request pointer lock automatically on start
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
    }
  };

  return (
    <div className="ui-container">
      {/* ── MENU ── */}
      {status === 'menu' && (
        <div className="overlay menu-screen">
          <div className="logo-wrapper">
            <h1 className="game-title">
              <span className="title-patty">Patty</span>
              <span className="title-panic">Panic</span>
            </h1>
            <p className="subtitle">✨ The Ultimate Runway ✨</p>
          </div>
          <div className="menu-controls">
            <button className="btn-play" onClick={handleStartGame}>
              <span className="btn-icon">▶</span> Começar Corrida
            </button>
            <div className="controls-hint">
              <p><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Mover</p>
              <p><kbd>Espaço</kbd> Pular</p>
              <p><kbd>Mouse</kbd> Câmera 360°</p>
              <p><kbd>ESC</kbd> Pausar</p>
            </div>
          </div>
        </div>
      )}

      {/* ── PAUSE ── */}
      {status === 'paused' && (
        <div className="overlay pause-screen">
          <h1 className="pause-title">⏸️ Pausado</h1>
          <div className="pause-buttons">
            <button className="btn-play" onClick={togglePause}>
              <span className="btn-icon">▶</span> Continuar
            </button>
            <button className="btn-play btn-restart" onClick={resetGame}>
              <span className="btn-icon">🔄</span> Reiniciar
            </button>
            <button className="btn-play btn-menu" onClick={() => setStatus('menu')}>
              <span className="btn-icon">🏠</span> Menu
            </button>
          </div>
          <p className="pause-hint">Pressione <kbd>ESC</kbd> para continuar</p>
        </div>
      )}

      {/* ── PAUSE BUTTON (during gameplay) ── */}
      {status === 'playing' && (
        <button className="btn-pause-corner" onClick={togglePause} title="Pausar (ESC)">
          ⏸
        </button>
      )}
      
      {/* ── WIN ── */}
      {status === 'finished' && (
        <div className="overlay win-screen">
          <h1 className="win-title">{phrase.title}</h1>
          <p className="win-subtitle">{phrase.subtitle}</p>
          <button className="btn-play btn-replay" onClick={resetGame}>
            <span className="btn-icon">🔄</span> Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};
