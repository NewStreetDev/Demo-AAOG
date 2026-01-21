# AAOG Frontend - Agricultural Management System

## Project Overview

This is the frontend for AAOG (Agricultural Management System), a comprehensive farm management platform built with React, TypeScript, and modern web technologies.

## Technology Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & State
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Server state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants
- **clsx + tailwind-merge** - Conditional class names

### Data & Forms
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **date-fns** - Date utilities

### Visualization
- **Recharts** - Charts and graphs
- **Leaflet + React-Leaflet** - Interactive maps

## Project Structure

```
src/
├── components/           # React components
│   ├── common/          # Shared components
│   │   ├── Layout/      # Layout components (MainLayout)
│   │   ├── Navigation/  # Navigation components
│   │   ├── Forms/       # Form components
│   │   ├── Tables/      # Table components
│   │   ├── Cards/       # Card components
│   │   └── Modals/      # Modal components
│   ├── apicultura/      # Beekeeping module components
│   ├── agro/            # Agriculture module components
│   ├── pecuario/        # Livestock module components
│   ├── finca/           # Farm management components
│   └── finanzas/        # Finance module components
├── pages/               # Page components
│   ├── apicultura/      # Beekeeping pages
│   ├── agro/            # Agriculture pages
│   ├── pecuario/        # Livestock pages
│   ├── finca/           # Farm management pages
│   └── finanzas/        # Finance pages
├── hooks/               # Custom React hooks
├── services/            # API and data services
│   ├── api/            # API integration
│   └── mock/           # Mock data for development
├── types/               # TypeScript type definitions
│   ├── common.types.ts
│   ├── apicultura.types.ts
│   ├── agro.types.ts
│   ├── pecuario.types.ts
│   ├── finca.types.ts
│   └── finanzas.types.ts
├── contexts/            # React context providers
├── utils/               # Utility functions
├── styles/              # Global styles
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── router.tsx          # Route configuration
```

## Modules

The system is organized into five main modules:

1. **Finca** (Farm Management)
   - General farm information
   - Workers and staff management
   - Equipment tracking

2. **Apicultura** (Beekeeping)
   - Apiary management
   - Hive tracking
   - Inspection records
   - Honey production

3. **Agro** (Agriculture)
   - Crop management
   - Planting schedules
   - Harvest tracking

4. **Pecuario** (Livestock)
   - Animal inventory
   - Health records
   - Breeding management

5. **Finanzas** (Finance)
   - Income and expense tracking
   - Budget management
   - Financial reports

## Color Scheme

The application uses a nature-inspired color palette:

- **Primary (Green)**: hsl(142, 76%, 36%) - Main farm/agriculture
- **Secondary (Brown)**: hsl(30, 25%, 45%) - Earth tones
- **Accent (Yellow)**: hsl(45, 93%, 47%) - Highlights
- **Apicultura (Yellow)**: hsl(45, 93%, 47%) - Beekeeping
- **Agro (Green)**: hsl(142, 76%, 36%) - Agriculture
- **Pecuario (Orange)**: hsl(25, 75%, 47%) - Livestock
- **Finca (Blue-Gray)**: hsl(200, 18%, 46%) - Farm
- **Finanzas (Blue)**: hsl(217, 91%, 60%) - Finance

## Available Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Development Server

The development server runs on:
- Local: http://localhost:5173/
- Network: http://192.168.68.102:5173/

## Type Definitions

All modules have their own TypeScript type definitions in the `src/types/` directory:

- `common.types.ts` - Shared types (BaseEntity, Farm, Status)
- `apicultura.types.ts` - Beekeeping types (Apiary, Hive, Inspection)
- `agro.types.ts` - Agriculture types (Crop, Harvest)
- `pecuario.types.ts` - Livestock types (Livestock, HealthRecord)
- `finca.types.ts` - Farm types (Worker, Equipment)
- `finanzas.types.ts` - Finance types (Transaction, Budget)

## Router Configuration

The application uses React Router v6 with nested routes:

- `/` - Dashboard home
- `/finca` - Farm management
  - `/finca/general` - General information
  - `/finca/workers` - Worker management
- `/apicultura` - Beekeeping
  - `/apicultura/apiaries` - Apiary list
  - `/apicultura/inspections` - Inspections
- `/pecuario` - Livestock
  - `/pecuario/inventory` - Animal inventory
- `/agro` - Agriculture
- `/finanzas` - Finance

## Features Implemented

- Responsive sidebar navigation with active state
- Dashboard with statistics cards
- Module-based routing structure
- TypeScript type definitions for all modules
- Tailwind CSS theming with custom colors
- React Query setup for data fetching
- Utility functions (cn for className merging)

## Next Steps

1. Implement individual module dashboards
2. Create data tables for each module
3. Build forms for data entry
4. Integrate with backend API
5. Add authentication and authorization
6. Implement data visualization (charts, maps)
7. Add comprehensive error handling
8. Create unit and integration tests

## Notes

- The project uses ES modules (type: "module" in package.json)
- TypeScript strict mode is enabled
- All imports use type-only imports where appropriate
- Node.js version warning can be ignored (running on 22.11.0, requires 22.12+)
