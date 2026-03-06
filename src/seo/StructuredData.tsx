
import React from 'react';

interface RaceResult {
  position: number;
  points: number;
  raceName: string;
  date: string;
}

interface StructuredDataProps {
  francoColapinto: {
    name: string;
    nationality: string;
    birthDate: string;
    team: string;
  };
  raceResults: RaceResult[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ francoColapinto, raceResults }) => {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: francoColapinto.name,
    nationality: francoColapinto.nationality,
    birthDate: francoColapinto.birthDate,
    jobTitle: 'Formula 1 Driver',
    affiliation: {
      '@type': 'SportsTeam',
      name: francoColapinto.team,
    },
  };

  const athleteSchema = {
    '@context': 'https://schema.org',
    '@type': 'Athlete',
    name: francoColapinto.name,
    nationality: francoColapinto.nationality,
    birthDate: francoColapinto.birthDate,
    memberOf: {
      '@type': 'SportsTeam',
      name: francoColapinto.team,
    },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: window.location.href,
    name: 'Franco Colapinto F1 Live Tracker',
    description: 'Live results, stats, and projections for Formula 1 driver Franco Colapinto.',
    author: {
      '@type': 'Person',
      name: 'Your Name or Company Name',
    },
  };
  
  // Example of how to map race results
  const eventsSchema = raceResults.map(result => ({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: result.raceName,
    startDate: result.date,
    competitor: {
      '@type': 'Person',
      name: francoColapinto.name,
    },
    location: {
      '@type': 'Place',
      name: result.raceName, // Assuming race name contains location
    },
  }));

  return (
    <script type="application/ld+json">
      {JSON.stringify([personSchema, athleteSchema, webSiteSchema, ...eventsSchema])}
    </script>
  );
};

export default StructuredData;
