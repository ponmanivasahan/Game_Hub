import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Volume2, VolumeX, Maximize2, Trophy } from 'lucide-react';

export default function PlayableDemoModal({ isOpen, onClose, gameTitle, demoUrl = 'builtin://retro-runner' }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gamepadName, setGamepadName] = useState(null);

  const audioCtxRef = useRef(null);

  useEffect(() => {
    const handleConnected = (e) => {
      setGamepadName(e.gamepad.id.replace(/\s*\([^)]*\)/g, '').slice(0, 24) || 'Controller');
    };
    const handleDisconnected = () => {
      setGamepadName(null);
    };

    window.addEventListener('gamepadconnected', handleConnected);
    window.addEventListener('gamepaddisconnected', handleDisconnected);

    const initialPads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of initialPads) {
      if (p) {
        setGamepadName(p.id.replace(/\s*\([^)]*\)/g, '').slice(0, 24) || 'Controller');
        break;
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected);
      window.removeEventListener('gamepaddisconnected', handleDisconnected);
    };
  }, []);

  const playBeep = (freq, type = 'square', duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setGameOver(false);
      return;
    }

    const savedBest = localStorage.getItem(`high_score_${gameTitle}`) || 0;
    setHighScore(parseInt(savedBest, 10));
  }, [isOpen, gameTitle]);

  useEffect(() => {
    if (!isOpen || !isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let currentScore = 0;

    const player = {
      x: 80,
      y: 220,
      width: 28,
      height: 38,
      vy: 0,
      jumpForce: -11.5,
      gravity: 0.55,
      isGrounded: true,
      color: '#c084fc'
    };

    let obstacles = [];
    let particles = [];
    let frame = 0;
    let gameSpeed = 5.2;

    const keys = {};

    const handleKeyDown = (e) => {
      keys[e.code] = true;
      if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && player.isGrounded) {
        player.vy = player.jumpForce;
        player.isGrounded = false;
        playBeep(480, 'square', 0.12);
      }
    };

    const handleKeyUp = (e) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      frame++;

      if (navigator.getGamepads) {
        const pads = navigator.getGamepads();
        for (let pIdx = 0; pIdx < pads.length; pIdx++) {
          const pad = pads[pIdx];
          if (pad && pad.connected) {
            const jumpPressed = pad.buttons[0]?.pressed || pad.buttons[12]?.pressed || (pad.axes[1] && pad.axes[1] < -0.4);
            if (jumpPressed && player.isGrounded) {
              player.vy = player.jumpForce;
              player.isGrounded = false;
              playBeep(480, 'square', 0.12);
              if (pad.vibrationActuator && typeof pad.vibrationActuator.playEffect === 'function') {
                pad.vibrationActuator.playEffect('dual-rumble', {
                  startDelay: 0,
                  duration: 60,
                  weakMagnitude: 0.7,
                  strongMagnitude: 0.3
                }).catch(() => {});
              }
            }
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f111a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 260);
      ctx.lineTo(canvas.width, 260);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.lineWidth = 1;
      const offsetX = (frame * gameSpeed) % 40;
      for (let x = -offsetX; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 260);
        ctx.lineTo(x - 60, canvas.height);
        ctx.stroke();
      }

      player.vy += player.gravity;
      player.y += player.vy;

      if (player.y >= 260 - player.height) {
        player.y = 260 - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(player.x + 16, player.y + 8, 5, 5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(player.x + player.width - 2, player.y + 14, 14, 4);

      if (frame % 85 === 0) {
        const height = 24 + Math.random() * 26;
        obstacles.push({
          x: canvas.width,
          y: 260 - height,
          width: 22,
          height: height,
          color: '#f43f5e'
        });
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;

        ctx.fillStyle = obs.color;
        ctx.beginPath();
        ctx.moveTo(obs.x, 260);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, 260);
        ctx.closePath();
        ctx.fill();

        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < 260 &&
          player.y + player.height > obs.y + 6
        ) {
          playBeep(160, 'sawtooth', 0.3);
          setGameOver(true);
          setIsPlaying(false);

          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem(`high_score_${gameTitle}`, String(currentScore));
          }
          return;
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
          currentScore += 10;
          setScore(currentScore);
          playBeep(880, 'sine', 0.05);

          if (currentScore % 50 === 0) {
            gameSpeed += 0.3;
          }
        }
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.fillText(`SCORE: ${currentScore}`, 20, 36);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, isPlaying, gameOver, gameTitle, highScore, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(5, 7, 12, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--accent-purple)',
          boxShadow: '0 0 40px var(--accent-purple-glow)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-purple">Playable Web Demo</span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{gameTitle}</span>
            {gamepadName && (
              <span className="badge badge-cyan desktop-only" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                🎮 {gamepadName}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn-icon"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-icon"
              title="Close Demo"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#090a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {!isPlaying && !gameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(9, 10, 15, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                textAlign: 'center',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                {gameTitle} — Arcade Trial
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '0.9rem' }}>
                Experience the atmosphere and responsive controls right in your browser. Jump over obstacle spikes and dodge hazards!
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(6,182,212,0.1)', padding: '0.45rem 1rem', borderRadius: 'var(--radius-full)' }}>
                Press <strong>SPACEBAR</strong>, <strong>UP ARROW</strong>, or <strong>🎮 GAMEPAD (A / D-PAD)</strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScore(0);
                  setIsPlaying(true);
                }}
                className="btn btn-primary btn-lg"
                style={{ marginTop: '0.5rem' }}
              >
                <Play size={18} fill="#fff" /> Start Playing Demo
              </button>
            </div>
          )}

          {gameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(9, 10, 15, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                textAlign: 'center'
              }}
            >
              <div style={{ color: 'var(--color-danger)', fontWeight: 800, fontSize: '1.8rem' }}>
                GAME OVER
              </div>
              <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                Score: {score}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Trophy size={14} color="#fbbf24" /> Best Score: {highScore}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setScore(0);
                    setGameOver(false);
                    setIsPlaying(true);
                  }}
                  className="btn btn-primary"
                >
                  <RotateCcw size={16} /> Play Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Back to Hub
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <span>Controls: <strong>SPACEBAR</strong> or <strong>W</strong> = Jump</span>
          <span>Web Audio & HTML5 Canvas Engine Active</span>
        </div>
      </div>
    </div>
  );
}
