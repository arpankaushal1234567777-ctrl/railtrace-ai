# RailTrace AI - Project Structure

```
railtrace-ai/
│
├── 📄 package.json                 # Dependencies: next, react, groq, supabase, framer-motion, lucide-react, react-hot-toast
├── 📄 tsconfig.json                # TypeScript config with @/* path alias
├── 📄 next.config.ts               # Next.js configuration (basic)
├── 📄 postcss.config.mjs            # PostCSS + Tailwind config
├── 📄 eslint.config.mjs             # ESLint rules
├── 📄 next-env.d.ts                 # Next.js type definitions
├── 📄 .env.local                    # Environment variables (Supabase, Groq keys)
├── 📄 README.md                     # Original Next.js template readme
│
├── 📁 public/                       # Static assets (empty by default)
│
├── 📁 src/
│   │
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📄 layout.tsx            # Root layout with metadata (RailTrace AI title)
│   │   ├── 📄 page.tsx              # Home page - renders Navbar + Hero + SearchBox
│   │   ├── 📄 globals.css           # All UI system styles, animations, responsive design
│   │   │
│   │   └── 📁 api/                  # API routes
│   │       ├── 📁 ai/
│   │       │   └── 📄 route.ts      # POST /api/ai - Main AI conversation handler with Groq
│   │       ├── 📁 train/
│   │       │   └── 📄 route.ts      # Empty stub for train data endpoint
│   │       └── 📁 station/
│   │           └── 📄 route.ts      # Empty stub for station search endpoint
│   │
│   ├── 📁 components/               # React components
│   │   │
│   │   ├── 📁 ui/                   # Core UI components
│   │   │   ├── 📄 Navbar.tsx        # App header with logo + "Live Railway Intelligence" badge
│   │   │   ├── 📄 Hero.tsx          # Hero section with headline + description
│   │   │   ├── 📄 SearchBox.tsx     # Main search orchestrator (input, voice, history, AI, results)
│   │   │   └── 📄 LoadingSkeleton.tsx # Shimmer-animated loading state
│   │   │
│   │   ├── 📁 train/                # Train-related components
│   │   │   ├── 📄 TrainMetrics.tsx  # Displays delay, occupancy, AI severity + risk card
│   │   │   ├── 📄 TrainRoute.tsx    # Visualizes journey with station dots + gradient lines
│   │   │   └── 📄 RecentSearches.tsx # Shows last 5 searches with quick reselect
│   │   │
│   │   ├── 📁 ai/                   # AI/Conversation components
│   │   │   ├── 📄 AIInsights.tsx    # Displays AI-generated insights with gradient header
│   │   │   ├── 📄 ChatMessages.tsx  # Renders conversation bubbles (user vs assistant)
│   │   │   └── 📄 TypingIndicator.tsx # Animated three-dot loading indicator
│   │   │
│   │   ├── 📁 layout/               # Layout components (empty, planned for future)
│   │   ├── 📁 search/               # Search-related components (empty, planned)
│   │   └── 📁 station/              # Station components (empty, planned)
│   │
│   ├── 📁 lib/                      # Utilities and services
│   │   ├── 📄 utils.ts              # detectQueryType(), getStatusColor() helper functions
│   │   ├── 📄 constants.ts          # Constants (empty, placeholder)
│   │   ├── 📄 groq.ts               # Groq SDK initialization
│   │   ├── 📄 supabase.ts           # Supabase client + saveSearch(), getRecentSearches()
│   │   ├── 📄 railway.ts            # getTrainData() - mock train data generation + generateAIInsights()
│   │   └── 📄 aiInsights.ts         # generateAIInsights() - risk scoring algorithm
│   │
│   ├── 📁 hooks/                    # Custom React hooks (empty, planned)
│   ├── 📁 services/                 # Service abstractions (empty, planned)
│   ├── 📁 types/                    # TypeScript interfaces (empty, planned)
│   └── 📁 styles/                   # Additional stylesheets (empty, planned)
│
└── 📁 .next/                        # Next.js build output (auto-generated)
    └── (build artifacts)
```

## File Purpose Reference

### Core Application
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Single-page entry point - renders full app layout |
| `src/app/layout.tsx` | Root layout wrapper with metadata |
| `src/app/globals.css` | **CENTRAL**: All UI styles, design tokens, animations |

### API Routes
| File | Method | Purpose | Status |
|------|--------|---------|--------|
| `src/app/api/ai/route.ts` | POST | Main AI conversation with Groq or mock train data | ✅ Active |
| `src/app/api/train/route.ts` | POST | Train data aggregation | ❌ Stub |
| `src/app/api/station/route.ts` | GET | Station search | ❌ Stub |

### UI Component Layer
| Component | Path | Purpose |
|-----------|------|---------|
| SearchBox | `components/ui/SearchBox.tsx` | **MAIN**: Search orchestrator, state management, voice search |
| Navbar | `components/ui/Navbar.tsx` | App header with branding |
| Hero | `components/ui/Hero.tsx` | Landing page headline |
| LoadingSkeleton | `components/ui/LoadingSkeleton.tsx` | Shimmer loading animation |
| TrainMetrics | `components/train/TrainMetrics.tsx` | Delay, occupancy, severity metrics |
| TrainRoute | `components/train/TrainRoute.tsx` | Station-by-station visualization |
| RecentSearches | `components/train/RecentSearches.tsx` | Search history list |
| AIInsights | `components/ai/AIInsights.tsx` | AI summary display |
| ChatMessages | `components/ai/ChatMessages.tsx` | Conversation bubbles |
| TypingIndicator | `components/ai/TypingIndicator.tsx` | Animated loading dots |

### Business Logic Layer
| File | Exports | Purpose |
|------|---------|---------|
| `lib/utils.ts` | `detectQueryType()`, `getStatusColor()` | Query classification, status styling |
| `lib/railway.ts` | `getTrainData()` | Mock train data generation with AI insights |
| `lib/aiInsights.ts` | `generateAIInsights()` | Risk score calculation (0-100) + severity classification |
| `lib/supabase.ts` | `supabase`, `saveSearch()`, `getRecentSearches()` | Database client and search persistence |
| `lib/groq.ts` | `groq` | Groq AI SDK instance |

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts (dev, build, start, lint) |
| `tsconfig.json` | TypeScript compiler options, path aliases (@/*) |
| `next.config.ts` | Next.js app configuration |
| `postcss.config.mjs` | PostCSS + Tailwind CSS pipeline |
| `eslint.config.mjs` | Linting rules |
| `.env.local` | Environment variables (Supabase, Groq API keys) |

## Data Flow Diagram

```
User Input (SearchBox)
    ↓
[detectQueryType] → "pnr" | "train" | "station" | "general"
    ↓
[POST /api/ai]
    ├─ If "train": [getTrainData] → mock data
    │   ↓
    │   [generateAIInsights] → risk analysis
    │   ↓
    │   Return JSON
    │
    └─ Else: [Groq LLaMA API] → AI response
        ↓
        Return JSON
    ↓
[setResult] (SearchBox state)
    ↓
Render: TrainCard + TrainMetrics + TrainRoute + AIInsights
    ↓
[saveSearch] → Supabase
    ↓
[getRecentSearches] → Update RecentSearches component
```

## Component Hierarchy

```
page.tsx (Home)
├── Navbar
│   ├── Logo
│   └── Badge (Live indicator)
├── Hero
│   ├── Headline
│   └── Description
└── SearchBox (state orchestrator)
    ├── Input field
    ├── Voice button
    ├── Search button
    ├── RecentSearches (if recent.length > 0)
    │   └── Recent search items
    ├── ChatMessages (if messages.length > 0)
    │   └── Message bubbles
    ├── TypingIndicator (if typing)
    ├── LoadingSkeleton (if loading)
    └── Result display (if result)
        ├── Train card header
        │   ├── Title
        │   ├── Summary
        │   └── Status pill
        ├── AIInsights
        │   ├── AI icon
        │   ├── Summary text
        │   └── Tags
        ├── Details grid
        │   ├── Train Number
        │   ├── Train Name
        │   ├── Source
        │   ├── Destination
        │   └── Duration
        ├── TrainMetrics
        │   ├── Delay card
        │   ├── AI Severity card
        │   ├── Occupancy card
        │   └── AI Risk Analysis
        └── TrainRoute
            └── Station list
                ├── Station dot
                ├── Station code
                └── Station name
```

## Key Implementation Notes

### State Management Location
- All state in **SearchBox.tsx**: query, loading, typing, result, recent, messages, type
- SearchBox is a "fat component" coordinating UI and data flow

### CSS Organization
- **Single file**: `src/app/globals.css` (900+ lines)
- Contains all design tokens, component styles, animations, responsive breakpoints
- Class naming convention: `rt-*` (RailTrace prefix)
- CSS variables: --bg, --surface, --accent, --text, --muted, --green

### Database
- **Supabase**: PostgreSQL database
- **Table**: `search_history` (id, query, query_type, created_at)
- Manual setup required - table must be created in Supabase dashboard

### API Response Format
- **Success**: `{ success: true, reply: "JSON string or plain text" }`
- **Error**: `{ success: false, error: "error message" }` (HTTP 500)

### Environment Setup
- Create `.env.local` with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  GROQ_API_KEY=...
  ```

## Planned Expansions

- [ ] `/src/types/` - TypeScript interfaces for data models
- [ ] `/src/hooks/` - Custom hooks (useSearch, useAI, useVoice, etc.)
- [ ] `/src/services/` - Service abstractions (RailwayService, AIService, etc.)
- [ ] `/api/train` - Real train data aggregation
- [ ] `/api/station` - Station schedule search
- [ ] User authentication & history per user
- [ ] Error boundary component
- [ ] Unit tests & E2E tests
