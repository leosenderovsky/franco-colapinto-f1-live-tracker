import React, { useState, useEffect } from 'react';
import CareerChart from './components/CareerChart';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Flag, Timer } from 'lucide-react';

import franco2024 from '../assets/img/franco_2024.png';
import auto2024 from '../assets/img/auto_fw46_2024.webp';
import bg2024 from '../assets/img/background_franco_2024.jpg';

import franco2025 from '../assets/img/franco_2025.png';
import auto2025 from '../assets/img/auto_a525_2025.webp';
import bg2025 from '../assets/img/background_franco_2025.jpg';

import franco2026 from '../assets/img/franco_2026.png';
import auto2026 from '../assets/img/auto_a526_2026.webp';
import bg2026 from '../assets/img/background_franco_2026.jpg';

import colapintoEvolution from '../assets/img/colapinto_evolution_composite.jpg';
import williamsLogo from '../assets/img/williams-f1-team.png';
import alpineLogo from '../assets/img/bwt-alpine-f1-team.png';

// 2. LÓGICA DE IDENTIDAD VISUAL (THEMING)
const SEASON_CONFIG = {
  2024: {
    year: 2024,
    team: 'Williams Racing',
    primaryColor: '#005AFF',
    accentColor: '#FFFFFF',
    // Portrait Franco: 800x1200px (PNG transparente, desde la cintura hacia arriba)
    driverImage: franco2024, 
    // Monoplaza: 1200x600px (PNG transparente, vista lateral o 3/4)
    carImage: auto2024, 
    // Backgrounds: 1920x1080px (Texturas de asfalto o circuitos difuminados)
    bgImage: bg2024, 
  },
  2025: {
    year: 2025,
    team: 'BWT Alpine F1 Team',
    primaryColor: '#0078C1',
    accentColor: '#FF70B7',
    driverImage: franco2025,
    carImage: auto2025,
    bgImage: bg2025,
  },
  2026: {
    year: 2026,
    team: 'BWT Alpine F1 Team',
    primaryColor: '#005090',
    accentColor: '#FF70B7',
    driverImage: franco2026,
    carImage: auto2026,
    bgImage: bg2026,
  }
};

type RaceResult = {
  round: string;
  raceName: string;
  date: string;
  Circuit: {
    circuitName: string;
    Location: { country: string; locality: string };
  };
  Results: Array<{
    position: string;
    grid: string;
    FastestLap?: { rank: string; Time: { time: string } };
    status: string;
  }>;
};

export default function App() {
    const [activeView, setActiveView] = useState<'Home' | 2024 | 2025 | 2026>('Home');
  const [selectedYear, setSelectedYear] = useState<2024 | 2025 | 2026>(2025);
  const [careerData, setCareerData] = useState<any[]>([]);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const config = SEASON_CONFIG[selectedYear];

  // 1. ESTRUCTURA DE DATOS Y API
  useEffect(() => {
    if (activeView !== 'Home') {
      setSelectedYear(activeView);
    } else {
      // Default hero for home view
      setSelectedYear(2025);
    }
  }, [activeView]);

  // Data Fetching Logic
  useEffect(() => {
    const fetchSeasonData = async (year: 2024 | 2025 | 2026) => {
      setLoading(true);
      setError(null);
      setResults([]);
      try {
        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/colapinto/results.json`);
        if (!response.ok) throw new Error('Error fetching data');
        const data = await response.json();
        const races = data.MRData?.RaceTable?.Races || [];
        setResults(races);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los resultados.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFullCareerData = async () => {
      setLoading(true);
      setError(null);
      setCareerData([]);
      let allRaces: any[] = [];
      let cumulativePoints = 0;

      for (const year of [2024, 2025, 2026]) {
        try {
          const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/drivers/colapinto/results.json`);
          if (!response.ok) continue;
          const data = await response.json();
          const races = data.MRData?.RaceTable?.Races || [];
          for (const race of races) {
            const result = race.Results[0];
            const points = parseInt(result.points, 10) || 0;
            cumulativePoints += points;
            allRaces.push({
              raceName: race.raceName,
              year,
              cumulativePoints,
              position: result.position,
            });
          }
        } catch (err) {
          console.error(`Error fetching data for ${year}:`, err);
        }
      }
      setCareerData(allRaces);
      setLoading(false);
    };

    if (activeView === 'Home') {
      fetchFullCareerData();
    } else {
      fetchSeasonData(activeView);
    }
  }, [activeView]);



  return (
    <div 
      className="min-h-screen bg-[#151921] text-slate-200 font-sans overflow-x-hidden transition-colors duration-700 ease-in-out relative"
      style={{ '--primary': config.primaryColor, '--accent': config.accentColor } as React.CSSProperties}
    >

      {/* The overlay is now part of the background layer's styling */}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header & Segmented Control */}
        <header className="px-6 py-4 md:px-8 md:py-5 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 bg-[#1A1D24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E10600] flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-red-500/20 pr-1">
              F1
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight text-white flex items-baseline gap-1">
                COLAPINTO<span className="text-[#007AFF]">.43</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                {activeView === 'Home' ? 'Live Tracker' : config.team}
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex p-1 rounded-full bg-[#151921] border border-white/5 shadow-inner">
              <button
                onClick={() => setActiveView('Home')}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeView === 'Home' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {activeView === 'Home' && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-[#007AFF]"
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                  />
                )}
                <span className="relative z-10">Home</span>
              </button>
              {[2024, 2025, 2026].map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveView(year as 2024 | 2025 | 2026)}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeView === year ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeView === year && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-[#007AFF]"
                      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    />
                  )}
                  <span className="relative z-10">{year}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative flex-1 flex items-center justify-start overflow-hidden text-white">
          {/* Background Image with Animation */}
          <AnimatePresence>
            <motion.div
              key={`hero-bg-${selectedYear}`}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${activeView === 'Home' ? bg2026 : config.carImage})` }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#151921] via-[#151921]/80 to-transparent"></div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-6 md:px-8 py-24 md:py-32 grid">
            <AnimatePresence>
              <motion.div
                key={`hero-content-${selectedYear}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl [grid-area:1/1]"
              >
                {activeView === 2026 && (
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-slate-300">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span>EN VIVO: Paddock Activo</span>
                  </div>
                )}
                
                <h2 className="font-black text-7xl md:text-9xl uppercase italic -skew-x-12 my-4 text-white" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                  Franco
                  <br />
                  Colapinto
                </h2>

                {activeView === 2026 ? (
                  <div className="flex items-stretch gap-8 border-t border-white/10 pt-6">
                    <div className="pl-4 border-l-2" style={{ borderColor: config.primaryColor }}>
                      <p className="text-xs uppercase tracking-widest text-white/60">Sesión Actual</p>
                      <p className="text-2xl font-semibold">Práctica Libre 1</p>
                    </div>
                    <div className="pl-4 border-l-2 border-white/20">
                      <p className="text-xs uppercase tracking-widest text-white/60">Objetivo</p>
                      <p className="text-2xl font-semibold">Top 10 Final</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 max-w-lg border-t border-white/10 pt-6">
                    {activeView === 'Home' && (
                      <p 
                        className="text-2xl font-bold uppercase tracking-wider text-slate-200"
                        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
                      >
                        Su trayectoria en la F1
                      </p>
                    )}
                    {activeView === 2024 && (
                      <img 
                        src={williamsLogo} 
                        alt="Williams Racing Logo" 
                        className="h-24"
                        style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.5))' }} 
                      />
                    )}
                    {activeView === 2025 && (
                      <img 
                        src={alpineLogo} 
                        alt="BWT Alpine F1 Team Logo" 
                        className="h-24"
                        style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.5))' }} 
                      />
                    )}
                  </div>
                )}


              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Results Section - Glassmorphism */}
        {activeView === 'Home' ? (
          <main id="home-chart-container" className="container mx-auto px-4 py-12 md:py-16 relative z-20">
            <div className="bg-[#1A1D24]/80 border border-white/5 rounded-3xl backdrop-blur-xl shadow-2xl shadow-black/20">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-300">Historial de posiciones</h2>
              </div>
              <div className="p-2 md:p-6" style={{ position: 'relative', height: '60vh' }}>
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" style={{ borderTopColor: config.primaryColor }} />
                  </div>
                ) : (
                  <CareerChart data={careerData.map(race => ({ raceName: race.raceName, cumulativePoints: race.cumulativePoints, position: race.position, year: race.year }))} />
                )}
              </div>
            </div>
          </main>
        ) : (
          <main className="container mx-auto px-4 py-12 md:py-24 relative z-20">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#1A1D24]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Puntos</p>
                <p className="text-5xl font-black text-white mt-2">4 <span className="text-lg text-green-400">+4 Últ. Carrera</span></p>
              </div>
              <div className="bg-[#1A1D24]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Pos. Piloto</p>
                <p className="text-5xl font-black text-white mt-2">19<span className="text-lg text-slate-400">vo</span></p>
              </div>
              <div className="bg-[#1A1D24]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Mejor Posición</p>
                <p className="text-5xl font-black text-white mt-2">P8</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" style={{ borderTopColor: config.primaryColor }} />
              </div>
            ) : results.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A1D24]/80 border border-white/5 rounded-3xl p-12 text-center backdrop-blur-xl"
              >
                <Calendar className="w-16 h-16 mx-auto mb-6 opacity-30" />
                <h3 className="text-2xl font-bold mb-2 text-white">Calendario Confirmado</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {error || `Los resultados de la temporada ${activeView} aún no están disponibles.`}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((race, index) => {
                  const result = race.Results[0];
                  return (
                    <motion.div
                      key={race.round}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#1A1D24]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/5 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-300 mb-1">{race.raceName}</p>
                          <p className="text-xs text-slate-400">{race.Circuit.Location.country}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-3xl font-black text-white`}>
                            P{result.position}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Parrilla</p>
                          <p className="font-mono text-lg text-white">P{result.grid}</p>
                        </div>
                        {result.FastestLap && (
                          <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Vuelta Rápida</p>
                            <p className="font-mono text-lg text-white">{result.FastestLap.Time.time}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        )}
        <footer className="container mx-auto px-4 py-6 md:px-8 border-t border-white/5 mt-auto">
          <div className="flex justify-center items-center text-sm">
            <p className="text-slate-400">Franco Colapinto F1 Live Tracker © 2026 Leo Aquiba Senderovsky</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
