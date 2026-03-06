import React from 'react';
import './ContextInjection.css';

interface ContextInjectionProps {
    currentRanking: number;
    totalPoints: number;
    nextRace: string;
}

const ContextInjection: React.FC<ContextInjectionProps> = ({ currentRanking, totalPoints, nextRace }) => {
    const summary = `
        Este es un sitio de seguimiento en tiempo real para Franco Colapinto, piloto de Formula 1. 
        Actualmente, Franco Colapinto está en la posición ${currentRanking} del campeonato con ${totalPoints} puntos.
        La próxima carrera es el ${nextRace}. El sitio provee resultados en vivo, estadísticas detalladas y proyecciones de carrera.
    `;

    return (
        <div className="visually-hidden" aria-live="polite">
            {summary}
        </div>
    );
};

export default ContextInjection;