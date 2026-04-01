import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'DATA_STREAM_01.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORRUPT_SECTOR.MP3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'VOID_NOISE.FLAC', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("ERR_AUDIO_PLAY:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="flex flex-col w-full h-full font-terminal text-2xl">
      <div className="border-b-4 border-[#FF00FF] pb-2 mb-6 flex justify-between items-end">
        <h2 className="font-pixel text-sm text-[#00FFFF] animate-glitch">AUDIO_SUBSYS</h2>
        <span className="text-[#FF00FF] text-xl animate-pulse">STATUS: {isPlaying ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      <div className="mb-8 bg-[#050505] p-4 border-2 border-[#00FFFF] relative overflow-hidden">
        <p className="text-[#FF00FF] mb-2 uppercase">&gt;&gt; EXEC_TRACK:</p>
        <p className="font-pixel text-xs md:text-sm text-[#00FFFF] truncate animate-glitch">
          {currentTrack.title}
        </p>
        
        <div className="flex gap-1 mt-6 h-12 items-end border-b-2 border-[#FF00FF] pb-1">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className="w-full bg-[#00FFFF]"
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                opacity: isPlaying ? (Math.random() > 0.5 ? 1 : 0.5) : 0.2
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 border-2 border-[#FF00FF] p-3">
        <button onClick={prevTrack} className="px-4 py-2 bg-[#00FFFF] text-black font-bold hover:bg-[#FF00FF] hover:text-[#00FFFF] transition-none uppercase">
          [PREV]
        </button>
        <button onClick={togglePlay} className="px-6 py-3 bg-[#FF00FF] text-[#00FFFF] font-pixel text-xs hover:bg-[#00FFFF] hover:text-[#FF00FF] transition-none uppercase animate-pulse">
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        <button onClick={nextTrack} className="px-4 py-2 bg-[#00FFFF] text-black font-bold hover:bg-[#FF00FF] hover:text-[#00FFFF] transition-none uppercase">
          [NEXT]
        </button>
      </div>

      <div className="mb-8">
        <p className="text-[#FF00FF] uppercase mb-2">&gt;&gt; VOL_CTRL: {Math.round(volume * 100)}%</p>
        <input 
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full appearance-none bg-[#00FFFF] h-3 cursor-pointer"
          style={{ accentColor: '#FF00FF' }}
        />
      </div>

      <div className="mt-auto border-t-4 border-[#00FFFF] pt-4">
        <p className="text-[#FF00FF] mb-3 uppercase">&gt;&gt; INDEXED_FILES:</p>
        <div className="flex flex-col gap-2">
          {TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
              className={`text-left px-3 py-2 text-2xl uppercase transition-none flex justify-between ${
                idx === currentTrackIndex 
                  ? 'bg-[#FF00FF] text-[#00FFFF] animate-glitch' 
                  : 'text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black'
              }`}
            >
              <span>{idx + 1}. {track.title}</span>
              {idx === currentTrackIndex && <span>&lt;</span>}
            </button>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} />
    </div>
  );
}
