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

  useEffect(() => {
    const bgElement = document.querySelector('.app-background-layer');
    if (bgElement) {
      (bgElement as HTMLElement).style.backgroundImage = `url(${config.bgImage})`;
    }
  }, [config.bgImage]);

  return (
    <div 
      className="min-h-screen bg-black text-white font-sans overflow-x-hidden transition-colors duration-700 ease-in-out relative"
      style={{ '--primary': config.primaryColor, '--accent': config.accentColor } as React.CSSProperties}
    >
      <div className="app-background-layer"></div>
      {/* The overlay is now part of the background layer's styling */}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header & Segmented Control */}
        <header className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div 
              className="text-5xl md:text-7xl font-black italic tracking-tighter"
              style={{ color: config.primaryColor, textShadow: `0 0 20px ${config.primaryColor}80` }}
            >
              43
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">Franco Colapinto</h1>
              <p className="text-sm md:text-base opacity-80 uppercase tracking-widest">
                {activeView === 'Home' ? 'F1 Live Tracker' : config.team}
              </p>
            </div>
          </div>

                    <div className="flex p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <button
              onClick={() => setActiveView('Home')}
              className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeView === 'Home' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
              {activeView === 'Home' && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: config.primaryColor }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">Home</span>
            </button>
            {[2024, 2025, 2026].map((year) => (
              <button
                key={year}
                onClick={() => setActiveView(year as 2024 | 2025 | 2026)}
                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeView === year ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {activeView === year && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: config.primaryColor }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{year}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Hero Section - Parallax & Layers */}
        <section className="relative flex-1 flex items-center justify-center min-h-[50vh] md:min-h-[60vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${selectedYear}`}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Driver Portrait (Background Layer) */}
              <motion.img
                src={config.driverImage}
                alt={`Franco Colapinto ${selectedYear}`}
                referrerPolicy="no-referrer"
                className="absolute bottom-0 h-[80%] md:h-[120%] object-contain object-bottom opacity-40 md:opacity-60 mix-blend-screen"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 0.4 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              {/* Car (Foreground Layer) */}
              <motion.img
                src={activeView === 'Home' ? bg2026 : config.carImage}
                alt={`Monoplaza ${selectedYear}`}
                referrerPolicy="no-referrer"
                className="absolute z-20 w-[90%] md:w-[70%] max-w-5xl object-contain drop-shadow-2xl"
                initial={{ x: '100vw', skewX: -10 }}
                animate={{ x: 0, skewX: 0 }}
                transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.1 }}
                style={{ filter: `drop-shadow(0 20px 30px ${config.primaryColor}40)` }}
              />
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Results Section - Glassmorphism */}
                {activeView === 'Home' ? (
                    <main id="home-chart-container" className="container mx-auto px-4 py-12 md:py-24 relative z-20">
            <h2 className="text-3xl font-bold uppercase tracking-wider flex items-center gap-3 mb-8">
              Historial de posiciones
            </h2>
             <div style={{ position: 'relative', height: '60vh' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${colapintoEvolution})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(5px) brightness(0.4)',
                zIndex: 1,
              }}></div>
              <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold uppercase tracking-wider flex items-center gap-3">
              <Flag className="w-8 h-8" style={{ color: config.accentColor }} />
              Resultados {activeView}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" style={{ borderTopColor: config.primaryColor }} />
            </div>
          ) : results.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center"
            >
              <Calendar className="w-16 h-16 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Calendario Confirmado</h3>
              <p className="text-white/60 max-w-md mx-auto">
                {error || `Los resultados de la temporada ${activeView} aún no están disponibles o la temporada no ha comenzado.`}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((race, index) => {
                const result = race.Results[0];
                const isPodium = parseInt(result.position) <= 3;
                const isPoints = parseInt(result.position) <= 10;
                
                return (
                  <motion.div
                    key={race.round}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all duration-300 overflow-hidden"
                  >
                    {/* Accent gradient on hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at top right, ${config.primaryColor}, transparent 70%)` }}
                    />

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                        <p className="text-sm font-mono text-white/50 mb-1">RND {race.round} • {new Date(race.date).toLocaleDateString()}</p>
                        <h3 className="text-xl font-bold leading-tight">{race.raceName}</h3>
                        <p className="text-sm text-white/70 mt-1">{race.Circuit.Location.country}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-black italic ${isPodium ? 'text-yellow-400' : isPoints ? 'text-white' : 'text-white/40'}`}>
                          P{result.position}
                        </div>
                        <p className="text-xs font-mono text-white/50 mt-1 uppercase">{result.status}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 relative z-10">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Clasificación</p>
                        <p className="font-mono text-lg">P{result.grid}</p>
                      </div>
                      {result.FastestLap && (
                        <div>
                          <p className="text-xs text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Timer className="w-3 h-3" /> Vuelta Rápida
                          </p>
                          <p className="font-mono text-lg">{result.FastestLap.Time.time}</p>
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

      </div>
    </div>
  );
}
