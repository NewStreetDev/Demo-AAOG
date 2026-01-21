# AAOG Frontend - Quick Start Guide

## Current Status

The development server is running and the application is accessible at:

- **Local URL**: http://localhost:5173/
- **Network URL**: http://192.168.68.102:5173/

## Project Location

```
/Users/ricardo/Desktop/Aso/aaog-frontend
```

## Quick Commands

```bash
# Navigate to project directory
cd /Users/ricardo/Desktop/Aso/aaog-frontend

# Start development server (if not already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## What You Can Do Right Now

1. **Open the application in your browser**
   - Visit http://localhost:5173/
   - You'll see the dashboard with statistics cards

2. **Navigate between modules**
   - Click on any module in the sidebar (Finca, Apicultura, Agro, Pecuario, Finanzas)
   - Navigation is fully functional with active state highlighting

3. **Explore the code structure**
   - All TypeScript types are defined in `src/types/`
   - Main layout is in `src/components/common/Layout/MainLayout.tsx`
   - Dashboard is in `src/pages/Home.tsx`
   - Routing configuration is in `src/router.tsx`

## Module Routes

```
Dashboard           →  /
Finca              →  /finca
  General Info     →  /finca/general
  Workers          →  /finca/workers
Apicultura         →  /apicultura
  Apiaries         →  /apicultura/apiaries
  Inspections      →  /apicultura/inspections
Pecuario           →  /pecuario
  Inventory        →  /pecuario/inventory
Agro               →  /agro
Finanzas           →  /finanzas
```

## Next Development Tasks

### Immediate Tasks (Day 1-2)
1. Build individual module dashboards
2. Create reusable card components
3. Add mock data for demonstration

### Short Term (Week 1)
1. Implement data tables for each module
2. Create forms for data entry
3. Add charts and visualizations
4. Implement map components

### Medium Term (Week 2-3)
1. Connect to backend API
2. Add authentication
3. Implement CRUD operations
4. Add data validation

### Long Term (Week 4+)
1. Add advanced filtering
2. Implement reporting features
3. Add export functionality
4. Performance optimization

## File Structure Reference

```
src/
├── App.tsx                    # Main app with React Query setup
├── main.tsx                   # Entry point
├── router.tsx                 # Route configuration
├── index.css                  # Tailwind + global styles
│
├── components/
│   ├── common/
│   │   └── Layout/
│   │       └── MainLayout.tsx # Main layout with sidebar
│   ├── apicultura/            # Empty (ready for components)
│   ├── agro/                  # Empty (ready for components)
│   ├── pecuario/              # Empty (ready for components)
│   ├── finca/                 # Empty (ready for components)
│   └── finanzas/              # Empty (ready for components)
│
├── pages/
│   ├── Home.tsx               # Dashboard page
│   ├── apicultura/            # Empty (ready for pages)
│   ├── agro/                  # Empty (ready for pages)
│   ├── pecuario/              # Empty (ready for pages)
│   ├── finca/                 # Empty (ready for pages)
│   └── finanzas/              # Empty (ready for pages)
│
├── types/
│   ├── common.types.ts        # BaseEntity, Farm, Status
│   ├── apicultura.types.ts    # Apiary, Hive, Inspection
│   ├── agro.types.ts          # Crop, Harvest
│   ├── pecuario.types.ts      # Livestock, HealthRecord
│   ├── finca.types.ts         # Worker, Equipment
│   └── finanzas.types.ts      # Transaction, Budget
│
└── utils/
    └── cn.ts                   # Utility for className merging
```

## Key Technologies

- **React 19** - Latest React features
- **TypeScript 5.9** - Type safety
- **Vite 7** - Lightning-fast builds
- **Tailwind CSS 4** - Utility-first styling
- **React Router 7** - Modern routing
- **TanStack Query 5** - Server state management
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible components

## Styling System

Custom colors are configured in `tailwind.config.js`:

```javascript
primary: 'hsl(142, 76%, 36%)'    // Green - Main theme
secondary: 'hsl(30, 25%, 45%)'   // Brown - Earth tones
accent: 'hsl(45, 93%, 47%)'      // Yellow - Highlights
apicultura: 'hsl(45, 93%, 47%)'  // Yellow - Beekeeping
agro: 'hsl(142, 76%, 36%)'       // Green - Agriculture
pecuario: 'hsl(25, 75%, 47%)'    // Orange - Livestock
finca: 'hsl(200, 18%, 46%)'      // Blue-Gray - Farm
finanzas: 'hsl(217, 91%, 60%)'   // Blue - Finance
```

## Development Tips

1. **Hot Module Replacement (HMR)** is enabled - changes appear instantly
2. **TypeScript errors** will show in terminal and browser
3. **Tailwind IntelliSense** recommended for VS Code
4. **React Query DevTools** available at bottom of screen (click icon)
5. **Component creation**: Follow existing structure in `components/`
6. **Type safety**: Always import types from `types/` directory

## Common Patterns

### Creating a new page component:
```typescript
// src/pages/apicultura/ApiariesList.tsx
export default function ApiariesList() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Apiaries</h1>
      {/* Content */}
    </div>
  );
}
```

### Using the utility function:
```typescript
import { cn } from '@/utils/cn';

<div className={cn("base-class", isActive && "active-class")} />
```

### Adding a new route:
```typescript
// In src/router.tsx
{
  path: 'apicultura/apiaries',
  element: <ApiariesList />,
}
```

## Troubleshooting

- **Port already in use**: Stop the dev server and restart
- **TypeScript errors**: Check imports use correct paths
- **Styling not working**: Ensure Tailwind classes are in content paths
- **Route not found**: Verify route configuration in `router.tsx`

## Documentation

- Full setup details: `PROJECT_SETUP.md`
- Setup completion status: `SETUP_COMPLETE.md`
- This quick start guide: `QUICKSTART.md`

---

**Ready to develop!** The foundation is solid and you can start building features immediately.
