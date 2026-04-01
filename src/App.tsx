import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <>
      <div className="crt-overlay"></div>
      <div className="static-noise"></div>
      <div className="scanline"></div>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 animate-tear">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-4xl font-pixel text-[#00FFFF] animate-glitch uppercase">
            SYS_FAIL // PROTOCOL_SNAKE
          </h1>
          <p className="text-[#FF00FF] font-terminal text-2xl mt-4 tracking-widest">
            [ UNEXPECTED_MEMORY_LEAK_DETECTED ]
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl items-center lg:items-stretch justify-center relative z-10">
          <div className="w-full lg:w-1/3 glitch-border bg-black p-6 flex flex-col">
            <MusicPlayer />
          </div>
          
          <div className="w-full lg:w-2/3 glitch-border bg-black p-6 flex flex-col items-center justify-center">
            <SnakeGame />
          </div>
        </div>
      </div>
    </>
  );
}
