import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import williamsLogoSrc from '../../assets/img/williams-f1-team.png';
import alpineLogoSrc from '../../assets/img/bwt-alpine-f1-team.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

interface CareerDataPoint {
  raceName: string;
  cumulativePoints: number;
  position: string;
  year: number;
}

interface CareerChartProps {
  data: CareerDataPoint[];
}

const CareerChart: React.FC<CareerChartProps> = ({ data }) => {

  const getYearZones = () => {
    const zones: { start: number; end: number; year: number }[] = [];
    if (data.length === 0) return [];

    let start = 0;
    let currentYear = data[0].year;

    data.forEach((d, i) => {
      if (d.year !== currentYear) {
        zones.push({ start, end: i - 0.5, year: currentYear });
        start = i - 0.5;
        currentYear = d.year;
      }
    });
    zones.push({ start, end: data.length - 1, year: currentYear });
    return zones;
  };

  const yearZones = getYearZones();

  const williamsLogo = new Image();
  williamsLogo.src = williamsLogoSrc;
  const alpineLogo = new Image();
  alpineLogo.src = alpineLogoSrc;

  const headerPlugin = {
    id: 'headerPlugin',
    afterDraw: (chart) => {
      const ctx = chart.ctx;

      williamsLogo.onload = () => chart.update();
      alpineLogo.onload = () => chart.update();

      yearZones.forEach(zone => {
        const xPos = chart.scales.x.getPixelForValue((zone.start + zone.end) / 2);

        ctx.save();
        ctx.font = `bold ${window.innerWidth < 768 ? 24 : 32}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

        let logo;
        if (zone.year === 2024) {
          logo = williamsLogo;
        } else {
          logo = alpineLogo;
        }

        if (logo.complete) {
            const logoHeight = 50;
            const logoWidth = (logo.width / logo.height) * logoHeight;
            const yPosImg = 15;
            ctx.drawImage(logo, xPos - logoWidth / 2, yPosImg, logoWidth, logoHeight);

            // Adjusted text position to be below the larger logo with a margin
            const yPosText = yPosImg + logoHeight + 35;
            ctx.fillText(zone.year.toString(), xPos, yPosText);
        }
        ctx.restore();
      });
    }
  };

  const lineAnnotations = yearZones.slice(0, -1).map((zone, i) => ({
    type: 'line' as const,
    xMin: zone.end,
    xMax: zone.end,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderDash: [5, 5],
  }));

  const boxAnnotations = yearZones.map((zone, i) => ({
    type: 'box' as const,
    xMin: zone.start,
    xMax: zone.end,
    backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    borderWidth: 0,
  }));

  const chartData = {
    labels: data.map(d => d.raceName),
    datasets: [
      {
        label: 'Posición Final',
        data: data.map(d => parseInt(d.position.replace('P', ''), 10)),
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        segment: {
          borderColor: ctx => {
            const year = data[ctx.p0.parsed.x]?.year;
            return year === 2024 ? '#005AFF' : '#0078C1';
          },
          backgroundColor: ctx => {
            const year = data[ctx.p0.parsed.x]?.year;
            return year === 2024 ? 'rgba(0, 90, 255, 0.2)' : 'rgba(0, 120, 193, 0.2)';
          }
        },
        pointBackgroundColor: (ctx) => {
            const year = data[ctx.dataIndex]?.year;
            return year === 2024 ? '#005AFF' : '#0078C1';
        },
        pointBorderColor: '#FFFFFF',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        // Adjusted top padding to reduce the margin
        top: 115,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const point = data[context.dataIndex];
            return `GP: ${point.raceName} (${point.year}) | Pos: ${point.position}`;
          },
        },
      },
      annotation: {
        annotations: [...lineAnnotations, ...boxAnnotations],
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        reverse: true,
        min: 1,
        max: 20,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return <Line options={options} data={chartData} plugins={[headerPlugin]}/>;
};

export default CareerChart;
