import React, { useEffect, useRef, useState } from 'react';
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
  Chart,
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
  cumulativePoints: number | null;
  position: string | null;
  year: number;
  isUpcoming?: boolean;
}

interface CareerChartProps {
  data: CareerDataPoint[];
}

const williamsLogo = new Image();
williamsLogo.src = williamsLogoSrc;
const alpineLogo = new Image();
alpineLogo.src = alpineLogoSrc;

const CareerChart: React.FC<CareerChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS<'line', (number | null)[], string>>(null);
  const [overlayBounds, setOverlayBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const handleResize = () => {
        setOverlayBounds(null);
        chart.update('none');
      };
      williamsLogo.onload = handleResize;
      alpineLogo.onload = handleResize;
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        williamsLogo.onload = null;
        alpineLogo.onload = null;
      };
    }
  }, []);

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

  const overlayPlugin = {
    id: 'overlayBoundsPlugin',
    afterRender: (chart: Chart) => {
      const completedCount = data.filter(d => !d.isUpcoming).length;
      const totalCount = data.length;

      if (completedCount >= totalCount) {
        if (overlayBounds) {
          setTimeout(() => setOverlayBounds(null), 0);
        }
        return;
      }

      const { chartArea, scales } = chart;
      const plotRight = chartArea.right;
      const plotTop = chartArea.top;
      const plotBottom = chartArea.bottom;

      let boxLeft;
      if (completedCount === 0) {
        boxLeft = chartArea.left;
      } else {
        const lastCompletedIndex = completedCount - 1;
        const lastCompletedX = scales.x.getPixelForValue(lastCompletedIndex);
        boxLeft = lastCompletedX + 4;
      }

      if (boxLeft >= plotRight) {
        if (overlayBounds) {
          setTimeout(() => setOverlayBounds(null), 0);
        }
        return;
      }

      const newBounds = {
        left: boxLeft,
        top: plotTop,
        width: plotRight - boxLeft,
        height: plotBottom - plotTop,
      };

      if (JSON.stringify(overlayBounds) !== JSON.stringify(newBounds)) {
        setTimeout(() => setOverlayBounds(newBounds), 0);
      }
    }
  };

  const headerPlugin = {
    id: 'headerPlugin',
    afterDraw: (chart: Chart) => {
      const ctx = chart.ctx;
      yearZones.forEach(zone => {
        const xPos = chart.scales.x.getPixelForValue((zone.start + zone.end) / 2);
        if (xPos < chart.chartArea.left || xPos > chart.chartArea.right) {
          return;
        }

        ctx.save();
        ctx.font = `bold ${window.innerWidth < 768 ? 24 : 32}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

        let logo = zone.year === 2024 ? williamsLogo : alpineLogo;

        if (logo.complete && logo.naturalHeight !== 0) {
          const logoHeight = 50;
          const logoWidth = (logo.width / logo.height) * logoHeight;
          const yPosImg = 15;
          ctx.drawImage(logo, xPos - logoWidth / 2, yPosImg, logoWidth, logoHeight);

          const yPosText = yPosImg + logoHeight + 35;
          ctx.fillText(zone.year.toString(), xPos, yPosText);
        }
        ctx.restore();
      });
    }
  };

  const lineAnnotations = yearZones.slice(0, -1).map(zone => ({
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
        data: data.map(d => d.position !== null ? parseInt(d.position.replace('P', ''), 10) : null),
        spanGaps: false,
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        segment: {
          borderColor: (ctx: any) => data[ctx.p0.parsed.x]?.year === 2024 ? '#005AFF' : '#0078C1',
          backgroundColor: (ctx: any) => data[ctx.p0.parsed.x]?.year === 2024 ? 'rgba(0, 90, 255, 0.2)' : 'rgba(0, 120, 193, 0.2)',
        },
        pointBackgroundColor: (ctx: any) => {
          const point = data[ctx.dataIndex];
          if (point?.isUpcoming) return 'rgba(255, 255, 255, 0.3)';
          return point?.year === 2024 ? '#005AFF' : '#0078C1';
        },
        pointBorderColor: '#FFFFFF',
        pointStyle: (ctx: any) => data[ctx.dataIndex]?.isUpcoming ? 'dash' : 'circle',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 140, left: 8, right: 8 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = data[context.dataIndex];
            if (point.position === null) return `GP: ${point.raceName} (${point.year}) | Carrera pendiente`;
            return `GP: ${point.raceName} (${point.year}) | Pos: ${point.position}`;
          },
        },
      },
      annotation: { annotations: [...lineAnnotations, ...boxAnnotations] },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        reverse: true,
        min: 1,
        max: 20,
        ticks: { color: 'rgba(255, 255, 255, 0.7)', stepSize: 1 },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Line ref={chartRef} options={options} data={chartData} plugins={[headerPlugin, overlayPlugin]} />
      {overlayBounds && (
        <div
          style={{
            position: 'absolute',
            left: overlayBounds.left,
            top: overlayBounds.top,
            width: overlayBounds.width,
            height: overlayBounds.height,
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <span style={{
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '0.03em',
          }}>
            🏁 Próximas carreras
          </span>
        </div>
      )}
    </div>
  );
};

export default CareerChart;
