import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
    gameContainerRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === ' ' && hasStarted) { setIsPaused(p => !p); return; }
      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': case 's': case 'S': if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': case 'a': case 'A': if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': case 'd': case 'D': if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, hasStarted]);

  useEffect(() => {
    if (isPaused || gameOver) return;
    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || 
            prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => { const ns = s + 10; if (ns > highScore) setHighScore(ns); return ns; });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        setDirection(currentDir);
        return newSnake;
      });
    };
    const speed = Math.max(40, BASE_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full font-terminal outline-none" tabIndex={0} ref={gameContainerRef}>
      <div className="flex justify-between items-center w-full max-w-md mb-6 border-b-4 border-[#00FFFF] pb-2">
        <div className="flex flex-col">
          <span className="text-[#FF00FF] uppercase text-xl">&gt;&gt; MEM_ALLOC</span>
          <span className="text-5xl text-[#00FFFF] animate-glitch">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[#FF00FF] uppercase text-xl">MAX_ALLOC &lt;&lt;</span>
          <span className="text-5xl text-[#00FFFF]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative bg-black border-4 border-[#FF00FF] shadow-[8px_8px_0px_#00FFFF] overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #00FFFF 1px, transparent 1px), linear-gradient(to bottom, #FF00FF 1px, transparent 1px)',
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }}
        ></div>

        {/* Game Board */}
        <div className="relative" style={{ width: 'min(100vw - 4rem, 400px)', height: 'min(100vw - 4rem, 400px)' }}>
          {/* Food */}
          <div
            className="absolute bg-[#FF00FF] animate-glitch"
            style={{
              width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
              left: `${(food.x / GRID_SIZE) * 100}%`, top: `${(food.y / GRID_SIZE) * 100}%`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${isHead ? 'bg-[#FFFFFF]' : 'bg-[#00FFFF]'}`}
                style={{
                  width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
                  left: `${(segment.x / GRID_SIZE) * 100}%`, top: `${(segment.y / GRID_SIZE) * 100}%`,
                  border: '1px solid #000'
                }}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-4 text-center">
            {gameOver ? (
              <>
                <h3 className="text-3xl md:text-4xl font-pixel text-[#FF00FF] mb-6 animate-glitch">FATAL_ERR</h3>
                <p className="text-2xl text-[#00FFFF] mb-8 bg-[#FF00FF]/20 p-3 border-2 border-[#00FFFF]">
                  DUMP: {score.toString().padStart(4, '0')} BYTES
                </p>
                <button onClick={resetGame} className="px-8 py-4 bg-[#00FFFF] text-black font-pixel text-sm hover:bg-[#FF00FF] hover:text-[#00FFFF] uppercase">
                  REBOOT_SYS
                </button>
              </>
            ) : !hasStarted ? (
              <>
                <h3 className="text-2xl font-pixel text-[#00FFFF] mb-8 animate-pulse">AWAITING_INPUT</h3>
                <button onClick={resetGame} className="px-8 py-4 bg-[#FF00FF] text-[#00FFFF] font-pixel text-sm hover:bg-[#00FFFF] hover:text-black uppercase">
                  INIT_SEQUENCE
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-pixel text-[#00FFFF] mb-8 animate-glitch">SYS_HALTED</h3>
                <button onClick={() => { setIsPaused(false); gameContainerRef.current?.focus(); }} className="px-8 py-4 bg-[#00FFFF] text-black font-pixel text-sm hover:bg-[#FF00FF] hover:text-[#00FFFF] uppercase">
                  RESUME_EXEC
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-2xl text-[#00FFFF] flex flex-col items-center gap-2 bg-[#FF00FF]/10 p-4 border-2 border-[#FF00FF]">
        <span>INPUT_VECTORS: [W][A][S][D] OR [ARROWS]</span>
        <span>INTERRUPT: [SPACE]</span>
      </div>
    </div>
  );
}
