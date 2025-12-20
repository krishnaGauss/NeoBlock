import React, { useState, useEffect } from 'react';
import { Grid, Users, Globe, ArrowRight, Zap, Radio, Cpu, Wifi } from 'lucide-react';
import useGameStore from '../store/gameStore';

export default function SetupScreen() {
  const initLocalGame = useGameStore((state) => state.initLocalGame);
  const createOnlineRoom = useGameStore((state) => state.createOnlineRoom);
  const joinOnlineRoom = useGameStore((state) => state.joinOnlineRoom);
  const errorMsg = useGameStore((state) => state.errorMsg);

  const [view, setView] = useState('menu'); // 'menu', 'local', 'online'
  const [joinCode, setJoinCode] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, pixelX: 0, pixelY: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
        pixelX: e.clientX,
        pixelY: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Local Game Options
  const localOptions = [
    { size: 15, walls: 7, label: "CLASSIC", desc: "Standard Warfare", color: "from-purple-500 to-indigo-500" },
    { size: 8, walls: 4, label: "BLITZ", desc: "Close Quarters", color: "from-cyan-500 to-blue-500" },
    { size: 6, walls: 3, label: "SUDDEN DEATH", desc: "Instant Conflict", color: "from-pink-500 to-rose-500" }
  ];

  return (
    <div className="h-screen w-screen bg-[#030305] text-white flex flex-col items-center justify-center overflow-hidden relative selection:bg-cyan-500/30 font-sans">
      
      {/* --- MOUSE FOLLOWER GRADIENT --- */}
      <div 
        className="fixed pointer-events-none z-10 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[80px] mix-blend-screen transition-transform duration-75 will-change-transform"
        style={{ 
            left: 0, 
            top: 0, 
            transform: `translate(${mousePos.pixelX - 300}px, ${mousePos.pixelY - 300}px)`,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 80%)'
        }}
      ></div>

      {/* --- CYBER BACKGROUND --- */}
      {/* 1. Perspective Grid (Floor) */}
      <div className="absolute inset-0 perspective-[1000px] pointer-events-none z-0">
        <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:60px_60px] [transform:rotateX(60deg)_translateY(-100px)_scale(2)] opacity-[0.15] animate-grid origin-top"
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 40%)' }}
        ></div>
      </div>
      
      {/* 2. Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>

      {/* 3. Noise Texture (Film Grain) */}
      <div className="absolute inset-0 z-[5] bg-noise pointer-events-none mix-blend-overlay"></div>

      {/* 4. Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030305_100%)] z-10 pointer-events-none"></div>

      {/* --- HUD DECORATIONS --- */}
      <div className={`absolute top-8 left-8 text-[10px] text-cyan-500/40 font-mono tracking-widest hidden md:block transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        SYS.READY<br/>
        V.2.0.4<br/>
        COORD: {mousePos.x.toFixed(2)} | {mousePos.y.toFixed(2)}
      </div>
      <div className={`absolute bottom-8 right-8 text-[10px] text-purple-500/40 font-mono tracking-widest hidden md:block text-right transition-opacity duration-1000 delay-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        NET_STATUS: CONNECTED<br/>
        SECURE_LINK: ACTIVE
      </div>
      
      {/* --- MAIN CONTENT --- */}
      <div className="relative z-20 w-full max-w-6xl flex flex-col items-center">
        
        {/* HEADER */}
        <div className={`mb-20 text-center relative transition-all duration-1000 transform ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <h1 className="glitch-text text-8xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] select-none" data-text="NEOBLOCK">
            NEOBLOCK
            </h1>
            <div className="absolute -bottom-6 left-0 w-full flex justify-between items-center text-cyan-400/40 font-mono text-xs tracking-[0.8em] uppercase animate-float">
                <span>// STRATEGY</span>
                <span className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-8"></span>
                <span>// WARFARE</span>
            </div>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
            <div className="mb-8 w-full max-w-md mx-auto relative group animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="absolute inset-0 bg-red-500/20 blur-md animate-pulse"></div>
                <div className="relative bg-red-950/80 backdrop-blur-md border border-red-500/50 text-red-200 px-6 py-4 rounded font-mono text-sm flex items-center gap-3 cyber-button shadow-xl">
                    <Zap size={16} className="text-red-500" />
                    <span className="font-bold tracking-wide">ERROR: {errorMsg}</span>
                </div>
            </div>
        )}

        {/* MENU VIEW */}
        {view === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-8">
                <div className={`transition-all duration-700 delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <CyberCard 
                        icon={Users}
                        title="LOCAL MATCH" 
                        subtitle="PvP on same device"
                        color="purple"
                        onClick={() => setView('local')}
                    />
                </div>
                <div className={`transition-all duration-700 delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <CyberCard 
                        icon={Globe}
                        title="MULTIPLAYER" 
                        subtitle="Online Network"
                        color="cyan"
                        onClick={() => setView('online')}
                    />
                </div>
            </div>
        )}

        {/* LOCAL SETUP VIEW */}
        {view === 'local' && (
            <div className="w-full px-8 fade-up-enter">
                 <button onClick={() => setView('menu')} className="mb-10 text-cyan-400/80 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center gap-3 group transition-all">
                    <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-all rounded-sm">
                        <ArrowRight className="rotate-180" size={14} />
                    </div>
                    BACK_TO_ROOT
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {localOptions.map((mode, idx) => (
                        <div key={mode.size} className={`fade-up-enter relative group`} style={{ animationDelay: `${idx * 100}ms` }}>
                            <button
                                onClick={() => initLocalGame(mode.size, mode.walls)}
                                className="w-full h-72 bg-[#05050A] border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-6 text-left"
                            >   
                                {/* Accent Line (Top) */}
                                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${mode.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                
                                {/* Header */}
                                <div className="flex justify-between items-start w-full relative z-10">
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-bold text-white tracking-tighter">{mode.size}x{mode.size}</span>
                                        <span className={`text-[10px] uppercase font-mono tracking-[0.2em] font-bold bg-clip-text text-transparent bg-gradient-to-r ${mode.color}`}>
                                            {mode.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <Grid size={20} className="text-white/20 group-hover:text-white/80 transition-colors mb-1 ml-auto" />
                                        <div className="text-[9px] text-gray-600 font-mono">GRID_SYS_0{idx + 1}</div>
                                    </div>
                                </div>

                                {/* Body / Tech Decos */}
                                <div className="relative z-10 flex-1 flex items-center justify-center py-4">
                                    {/* Visual representation of grid density */}
                                    <div className="w-full h-16 flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`h-full flex-1 bg-current rounded-sm ${i % 2 === 0 ? 'mt-4' : 'mb-4'}`}
                                                style={{ color: i < (mode.size / 2) ? 'white' : 'transparent', border: '1px solid white' }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="relative z-10 border-t border-white/5 pt-4 group-hover:border-white/10 transition-colors w-full">
                                    <div className="flex justify-between items-center text-xs font-mono text-gray-400 group-hover:text-gray-300">
                                        <span>WALLS: {mode.walls}</span>
                                        <span>DIFFICULTY: {idx + 1}/3</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 font-sans leading-relaxed group-hover:text-gray-400 transition-colors">
                                        {mode.desc}
                                    </p>
                                </div>

                                {/* Hover Glow Background */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                            </button>
                            
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* ONLINE SETUP VIEW */}
        {view === 'online' && (
             <div className="w-full max-w-xl px-4 fade-up-enter">
                 <button onClick={() => setView('menu')} className="mb-10 text-cyan-400/80 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center gap-3 group transition-all">
                    <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-black transition-all rounded-sm">
                        <ArrowRight className="rotate-180" size={14} />
                    </div>
                    BACK_TO_ROOT
                </button>

                <div className="bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 p-10 cyber-button relative overflow-hidden">
                    <div className="shine-effect delay-300"></div>
                    
                    {/* Decorative lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="mb-10 relative z-10">
                        <h3 className="text-xs font-bold text-cyan-500 mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <Wifi size={14} />
                            Create New Session
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => createOnlineRoom(15, 7)} className="group p-5 bg-white/5 border border-white/5 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all text-left relative overflow-hidden rounded-lg">
                                <span className="block font-black text-xl text-white group-hover:text-cyan-400 transition-colors mb-1">CLASSIC</span>
                                <span className="text-xs text-gray-500 font-mono group-hover:text-cyan-400/60 transition-colors">15x15 GRID</span>
                             </button>
                             <button onClick={() => createOnlineRoom(8, 4)} className="group p-5 bg-white/5 border border-white/5 hover:border-purple-400/50 hover:bg-purple-950/30 transition-all text-left relative overflow-hidden rounded-lg">
                                <span className="block font-black text-xl text-white group-hover:text-purple-400 transition-colors mb-1">BLITZ</span>
                                <span className="text-xs text-gray-500 font-mono group-hover:text-purple-400/60 transition-colors">8x8 GRID</span>
                             </button>
                        </div>
                    </div>

                    <div className="relative flex items-center gap-4 mb-8 z-10">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">or join existing</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <div className="flex gap-0 relative z-10 shadow-2xl">
                        <div className="relative flex-1 group">
                            <input 
                                type="text" 
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CODE"
                                className="relative w-full bg-[#05050a] border border-white/10 border-r-0 px-6 py-4 text-white font-mono text-lg tracking-[0.2em] placeholder:text-gray-800 focus:outline-none focus:border-cyan-500/50 transition-all h-16 rounded-l-lg focus:bg-white/5"
                                maxLength={6}
                            />
                        </div>
                        <button 
                            onClick={() => joinOnlineRoom(joinCode)}
                            disabled={joinCode.length < 6}
                            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 h-16 font-bold transition-all border border-cyan-500 hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] flex items-center justify-center gap-2 rounded-r-lg"
                        >
                            CONNECT
                        </button>
                    </div>

                </div>
             </div>
        )}

      </div>
    </div>
  );
}

// Sub-component for Menu Cards
function CyberCard({ icon: Icon, title, subtitle, color, onClick }) {
    const colorClasses = {
        purple: "group-hover:text-purple-400 group-hover:border-purple-500/50 group-hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)]",
        cyan: "group-hover:text-cyan-400 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.3)]"
    };

    return (
        <button 
            onClick={onClick}
            className={`group relative h-64 w-full bg-[#0a0a12]/60 backdrop-blur-sm border border-white/5 p-10 text-left transition-all duration-500 cyber-button overflow-hidden ${colorClasses[color]} hover:-translate-y-2`}
        >
            {/* Hover Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${color === 'purple' ? 'from-purple-500/10' : 'from-cyan-500/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            
            {/* Soft Glow Blob */}
            <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${color === 'purple' ? 'bg-purple-600' : 'bg-cyan-600'}`}></div>

            <div className="shine-effect"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/20 transition-colors duration-500 group-hover:scale-110 origin-top-left">
                        <Icon size={32} className="text-gray-400 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="text-white/80" />
                    </div>
                </div>
                <div>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 group-hover:translate-x-2 transition-transform duration-500">{title}</h3>
                    <p className="text-gray-500 font-mono text-xs tracking-widest uppercase group-hover:text-gray-300 transition-colors">{subtitle}</p>
                </div>
            </div>
        </button>
    );
}
