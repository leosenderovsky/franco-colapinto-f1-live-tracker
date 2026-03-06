import React from 'react';

interface RaceData {
    raceName: string;
    results: {
        position: number;
        driver: string;
        points: number;
    }[];
}

interface ChampionshipStandings {
    position: number;
    driver: string;
    points: number;
}

interface SemanticStructureProps {
    lastRace: RaceData;
    championshipStandings: ChampionshipStandings[];
}

const SemanticStructure: React.FC<SemanticStructureProps> = ({ lastRace, championshipStandings }) => {
  return (
    <main>
      <article aria-labelledby="last-race-results">
        <h2 id="last-race-results">Resultados de la Última Carrera: {lastRace.raceName}</h2>
        <section aria-label="Race Results Table">
          <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Piloto</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {lastRace.results.map((result, index) => (
                <tr key={index}>
                  <td>{result.position}</td>
                  <td>{result.driver}</td>
                  <td>{result.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>

      <aside aria-labelledby="championship-standings">
        <h2 id="championship-standings">Tabla de Posiciones del Campeonato</h2>
        <section aria-label="Championship Standings Table">
        <table>
            <thead>
              <tr>
                <th>Posición</th>
                <th>Piloto</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {championshipStandings.map((standing, index) => (
                <tr key={index}>
                  <td>{standing.position}</td>
                  <td>{standing.driver}</td>
                  <td>{standing.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </aside>
    </main>
  );
};

export default SemanticStructure;