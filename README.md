<div align="center">
  
# 🏁 Franco Colapinto F1 Live Tracker

### **Interactive Infographic & Real-Time Dashboard** for Franco Colapinto's Formula 1 Career

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*A cutting-edge web experience showcasing Franco Colapinto's F1 journey with dynamic theming, real-time data integration, and premium glassmorphism design.*

</div>

---

## 🎯 Overview

**Franco Colapinto F1 Live Tracker** is an interactive dashboard that chronicles Franco Colapinto's Formula 1 career across multiple seasons (2024-2026). It features:

- ✨ **Dynamic Hero Sections** with season-specific theming
- 📊 **Career Evolution Chart** tracking cumulative points across all seasons
- 🏆 **Race Results Dashboard** with detailed performance metrics
- 📅 **Upcoming Race Information** with real-time calendar integration
- 🎨 **Glassmorphism UI Design** for a premium, modern aesthetic
- ⚡ **Smooth Animations** powered by Framer Motion
- 📡 **Live API Integration** with Jolpica Ergast F1 database
- 📱 **Fully Responsive** across all devices

---

## 🎨 Design Philosophy

### **Glassmorphism Aesthetic**

The application embraces modern UI design principles with:

```
Semi-transparent backgrounds: rgba(255, 255, 255, 0.05-0.10)
Frosted glass effects: backdrop-blur-xl
Subtle borders: border-white/10
Smooth color transitions: duration-300 to duration-700
```

### **Color Palette**

| Season | Primary | Accent | Team |
|--------|---------|--------|------|
| 2024 | `#005AFF` | `#FFFFFF` | 🏎️ Williams Racing |
| 2025 | `#0078C1` | `#FF70B7` | 🏎️ BWT Alpine F1 |
| 2026 | `#005090` | `#FF70B7` | 🏎️ BWT Alpine F1 |

---

## 🏗️ Architecture

### **Component Structure**

```
src/
├── App.tsx ..................... Main application component
│   ├── Header & Navigation ... Segment control for season switching
│   ├── Hero Section ........... Dynamic theme-based viewport
│   ├── Career Chart ........... Historical performance visualization
│   └── Results Section ....... Season-specific race data cards
├── components/
│   └── CareerChart.tsx ........ Chart.js wrapper with custom annotations
├── main.tsx ................... React DOM entry point
├── index.css .................. Tailwind & global styles
└── vite-env.d.ts .............. TypeScript definitions
```

### **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────┐
│              User Interaction (Navigation)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   activeView State Change  │
        └────────┬───────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│  Career Data │    │ Season Data      │
│  (All Years) │    │ (Results/Points) │
└──────────────┘    └──────────────────┘
      │                     │
      │    ┌────────────────┘
      │    │
      ▼    ▼
  ┌─────────────────┐
  │   UI Components │
  │   (Animated)    │
  └─────────────────┘
```

---

## 🔧 Tech Stack

### **Frontend**
- **React 19.0** - UI component library with hooks
- **TypeScript 5.8** - Type-safe JavaScript
- **Tailwind CSS 4.1** - Utility-first styling with @tailwindcss/vite
- **Vite 6.2** - Lightning-fast build tool

### **Animations & Interactions**
- **Framer Motion 12.23** - Production-ready animation library
  - `AnimatePresence` for mount/unmount transitions
  - `motion.div` for dynamic interpolations
  - Custom easing: `easeInOut` & `tween` transitions

### **Data Visualization**
- **Chart.js 4.5** - Powerful charting library
- **React-ChartJS-2 5.3** - React wrapper for Chart.js
- **ChartJS Plugin Annotation 3.1** - Custom chart annotations

### **Icons & Visual Elements**
- **Lucide React 0.546** - Beautiful, consistent SVG icons
  - Calendar, Flag, Timer icons for UI elements

### **Build & Development**
- **@vitejs/plugin-react 5.0.4** - Reactor plugin for Vite
- **TypeScript** - Development type checking
- **Autoprefixer 10.4** - CSS vendor prefixes

---

## 📡 API Integration

### **Data Source: Ergast F1 API**

The application consumes data from the **Jolpica Ergast F1 API**:

```bash
# Season Results
https://api.jolpi.ca/ergast/f1/{year}/drivers/colapinto/results.json

# Driver Standings
https://api.jolpi.ca/ergast/f1/{year}/drivers/colapinto/driverStandings.json

# Calendar & Race Information
https://api.jolpi.ca/ergast/f1/{year}.json
```

### **Next Race Logic**

The application intelligently fetches the next upcoming race:

```typescript
const getNextRace = () => {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const futureRaces = calendar2026.filter(race => {
    const raceDate = new Date(race.date);
    const raceDateOnly = new Date(raceDate.getFullYear(), raceDate.getMonth(), raceDate.getDate());
    return raceDateOnly >= currentDate;
  });
  
  return futureRaces[0] || null;
};
```

---

## ⚙️ Key Features in Detail

### **1. Dynamic Theme Switching**

```tsx
const SEASON_CONFIG = {
  2024: { primaryColor: '#005AFF', team: 'Williams Racing', ... },
  2025: { primaryColor: '#0078C1', team: 'BWT Alpine F1 Team', ... },
  2026: { primaryColor: '#005090', team: 'BWT Alpine F1 Team', ... },
};
```

The theme CSS variable (`--primary`, `--accent`) updates seamlessly with spring transitions.

### **2. Career Chart with Annotations**

Custom Chart.js annotations display:
- **Year zones** with alternating background colors
- **Vertical separators** between seasons
- **Team labels** positioned above the chart
- **Real-time point accumulation** visualization

### **3. Real-Time Results Dashboard**

For each season, display metrics:
- Total points scored
- Championship position
- Best race result
- Points from last race

### **4. Next Race Block** (2026 Season)

A glassmorphic card showing:
- Grand Prix name
- Date in Spanish locale
- Circuit name with geography (City, Country)
- Calendar icon with hover animation

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ (npm or yarn)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/franco-colapinto-f1-live-tracker.git
cd franco-colapinto-f1-live-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
```

### **Development Server**

```bash
npm run dev
```

The app will start at `http://localhost:3000` with hot module replacement (HMR) enabled.

### **Build for Production**

```bash
npm run build      # Compile to dist/
npm run preview    # Test production build locally
npm run clean      # Clear build artifacts
```

### **Code Quality**

```bash
npm run lint       # Type-check with TypeScript
```

---

## 📊 Performance Optimizations

- ✅ **Lazy Loading** - Components animate in on switch
- ✅ **Memoization** - React.memo prevents unnecessary renders
- ✅ **CSS-in-JS** - Tailwind's Just-In-Time compilation
- ✅ **Vite's ES Modules** - Direct browser imports during dev
- ✅ **Code Splitting** - Automatic chunk generation on build
- ✅ **Image Optimization** - WebP and JPEG formats
- ✅ **API Caching** - State management with React hooks

---

## 🎭 Component Breakdown

### **App.tsx**

**Main orchestration component** managing:
- Season selection state (`activeView`: 'Home' | 2024 | 2025 | 2026)
- API data fetching with error handling
- Career aggregation across all years
- Responsive layout with Hero + Results sections

**Key Hooks:**
```tsx
const [activeView, setActiveView] = useState<'Home' | 2024 | 2025 | 2026>('Home');
const [results, setResults] = useState<RaceResult[]>([]);
const [calendar2026, setCalendar2026] = useState<any[]>([]);
const [standings, setStandings] = useState<any>(null);
```

### **CareerChart.tsx**

**Chart.js visualization** featuring:
- Line chart with gradient fills
- Custom year-zone annotations
- Reverse Y-axis (P1 at top)
- Responsive design (font size adjusts)
- Smooth animations on data updates

---

## 🔒 Error Handling

### **API Failure Resilience**

```typescript
// Graceful degradation
try {
  const response = await fetch(apiEndpoint);
  if (!response.ok) throw new Error('API error');
  // Process data...
} catch (err) {
  console.error('Error fetching data:', err);
  setError('No se pudieron cargar los datos.');
  setResults([]);
}
```

### **UI Safeguards**

- Missing data → fallback UI messages
- Failed API → no block renders (interface stays intact)
- Date parsing errors → logged, not thrown
- Invalid race data → pre-filtered before render

---

## 📱 Responsive Design

| Breakpoint | Width | Adjustments |
|-----------|-------|------------|
| Mobile | < 768px | Single column, optimized fonts |
| Tablet | 768px - 1024px | Balanced spacing |
| Desktop | ≥ 1024px | Full width layout |

---

## 🎬 Animation Techniques

- **Page Transitions** - `AnimatePresence` with opacity fades
- **Scale Transforms** - Dynamic scaling on viewport changes
- **Border Highlighting** - Season-specific color accents
- **Hover Effects** - Subtle background elevation
- **Loading States** - Animated spinners using primary colors
- **Live Indicators** - Pulsing animations for active states

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes with descriptive messages
4. Push to your fork and submit a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 About

Created with ❤️ by **Leo Aquiba Senderovsky** | © 2026

*Passionate about Formula 1, modern web design, and real-time data visualization.*

---

<div align="center">

### 🏎️ *Speed. Precision. Excellence.* 🏁

**Celebrating Franco Colapinto's F1 Career with Modern Web Technology**

[Star ⭐](../../) • [Report Issues](../../issues) • [View Live](https://franco-colapinto-tracker.vercel.app)

</div>
