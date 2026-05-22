# RailTrace AI

## Purpose

RailTrace AI is an intelligent Indian Railways platform that provides real-time train tracking, conversational railway assistance, and AI-powered analytics. Users can search for trains using train numbers, PNR codes, or station codes, and receive instant feedback with delay analysis, route information, and AI-generated insights.

## Tech Stack

### Frontend & Framework
- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **Runtime**: React 19
- **Styling**: Tailwind CSS 4 + PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Utilities**: clsx

### Backend & APIs
- **Server**: Next.js API Routes (serverless)
- **AI Service**: Groq SDK (LLaMA 3.1 8B Instant model)
- **Database**: Supabase (PostgreSQL)
- **Client Lib**: Supabase JavaScript client

### Environment
- **Node Runtime**: ES2017 target
- **Path Aliases**: `@/*` → `./src/*`
- **Deployment**: Compatible with Vercel

## Architecture Overview

### Frontend Architecture
- **Pattern**: Client-side React with server components planning
- **State Management**: React hooks (useState, useEffect) - local component state
- **Routing**: Next.js App Router (single page: `/`)
- **Data Flow**:
  1. User enters query in SearchBox
  2. detectQueryType() determines query nature (PNR/train/station/general)
  3. Request sent to /api/ai with context messages
  4. Response parsed and displayed via components
  5. Search saved to Supabase for history

### Backend Architecture
- **API Routes**:
  - `POST /api/ai` - Main AI conversation endpoint (active)
  - `GET/POST /api/train` - Train data endpoint (stub)
  - `GET/POST /api/station` - Station data endpoint (stub)
- **Services**:
  - Groq AI integration for natural language understanding
  - Railway data generation via getTrainData()
  - Risk analysis via generateAIInsights()
  - Supabase search persistence

### API Flow
```
SearchBox Component
    ↓
detectQueryType(query) → "train" | "pnr" | "station" | "general"
    ↓
POST /api/ai
    ├─ If type === "train": getTrainData() + generateAIInsights()
    └─ Else: Groq Chat Completion with LLaMA 3.1 8B
    ↓
Response: JSON with title, summary, status, details, route, insights
    ↓
TrainMetrics + TrainRoute + AIInsights render
    ↓
saveSearch(query, type) → Supabase search_history
```

### State Management
- **Local Component State**: SearchBox manages query, loading, typing, result, messages, recent, type
- **Conversation Memory**: messages array maintains multi-turn context for AI
- **Recent Searches**: Loaded from Supabase on mount, updated after each search

### Data Flow
```
User Input → detectQueryType → API Call → AI/Train Data
    ↓
Parse JSON Response → setResult() → Re-render
    ↓
Save Search → getRecentSearches() → Update UI
```

### AI Flow
1. User sends message through SearchBox
2. Message added to conversation messages array
3. POST /api/ai with full message history
4. Groq AI responds based on system prompt (railway expert role)
5. Response parsed as JSON (with fallback to plain text)
6. Assistant message appended to history
7. Chat bubbles rendered via ChatMessages component

## Existing Features

### Search & Query Detection
- ✅ **PNR Search**: 10-digit numbers (e.g., "1234567890")
- ✅ **Train Search**: 4-5 digit train codes (e.g., "12301", "2301")
- ✅ **Station Search**: 2-5 letter station codes (e.g., "NDLS", "BCT")
- ✅ **General Query**: Natural language questions about railways
- ✅ **Voice Search**: Web Speech API integration with Indian English locale

### Train Information Display
- ✅ **Train Status Tracking**: LIVE, DELAYED, ARRIVED, CANCELLED, RESCHEDULED, ON TIME
- ✅ **Delay Metrics**: Display in minutes
- ✅ **Train Details**: Number, name, source, destination, duration
- ✅ **Occupancy Tracking**: Percentage displayed
- ✅ **Speed Information**: Available in data model

### Route Visualization
- ✅ **Station-by-Station Route**: Animated route with dots and connecting lines
- ✅ **Station Details**: Code and full name for each stop
- ✅ **Visual Connections**: Gradient lines between stations

### AI & Analytics
- ✅ **AI Risk Analysis**: Calculates risk score (0-100) based on metrics
- ✅ **Severity Classification**: Low, Moderate, High, Critical
- ✅ **Risk Factors**: Delay weight, low speed detection, long route risk, high occupancy risk
- ✅ **AI Recommendations**: Smart suggestions based on risk analysis
- ✅ **Conversational AI**: Multi-turn conversation via Groq LLaMA 3.1

### Search History & Persistence
- ✅ **Search History**: Last 5 searches shown on landing
- ✅ **Supabase Integration**: Stores query and query_type with timestamps
- ✅ **Quick Reselection**: Click recent search to repopulate query box

### UI/UX Features
- ✅ **Loading Skeleton**: Shimmer animation while fetching
- ✅ **Typing Indicator**: Shows when AI is responding
- ✅ **Status Badges**: Color-coded train status pills
- ✅ **Chat Bubbles**: Conversation history display
- ✅ **Query Type Indicator**: Shows detected query type
- ✅ **Responsive Design**: Mobile and desktop layouts

## Existing Components

### Layout Components
- **Navbar**: Logo display + "Live Railway Intelligence" badge with green pulse dot
- **Hero**: Centered headline and description of platform

### Search Components
- **SearchBox**: Main input with voice button and search button, full orchestration
- **RecentSearches**: Card showing last 5 searches with query type labels

### Train Information Components
- **TrainMetrics**: Grid of metrics (delay, AI severity, occupancy) + AI Risk Analysis card
- **TrainRoute**: Visualizes journey with station dots and connecting gradient lines

### AI Components
- **AIInsights**: Displays AI-generated insights with gradient header and tags
- **ChatMessages**: Renders conversation bubbles (user vs assistant styling)
- **TypingIndicator**: Animated three-dot loading indicator

### UI Components
- **LoadingSkeleton**: Shimmer-animated skeleton for loading state
- **Hero**: Headline and subtitle
- **Navbar**: App header

## Existing API Routes

### POST /api/ai
**Purpose**: Main AI conversation endpoint with intelligent routing

**Request Body**:
```json
{
  "message": "string",
  "type": "train" | "pnr" | "station" | "general",
  "messages": [{ "role": "user|assistant", "content": "string" }]
}
```

**Response**:
```json
{
  "success": true,
  "reply": "JSON stringified or plain text response"
}
```

**Logic**:
- If type === "train": Returns mock train data + AI insights (no Groq call)
- Else: Calls Groq LLaMA 3.1 8B with full message history

**System Prompt**: Sets context as "RailTrace AI, an intelligent Indian Railways copilot"

### GET/POST /api/train
**Status**: Empty stub - no implementation

### GET/POST /api/station
**Status**: Empty stub - no implementation

## Existing Utilities & Services

### lib/utils.ts
- `detectQueryType(query: string)` → "pnr" | "train" | "station" | "general"
  - 10 digits → PNR
  - 4-5 digits → train code
  - 2-5 uppercase letters → station code
  - Else → general query
- `getStatusColor(status: string)` → CSS class name for status pills
  - Maps "live", "running", "on time" → "live" (green)
  - Maps "delay" → "delayed" (yellow)
  - Maps "cancel" → "cancelled" (red)
  - Maps "arrive" → "arrived" (blue)

### lib/railway.ts
- `getTrainData(trainNumber: string)` → Returns mock train object with:
  - Title, summary, status
  - Delay, speed
  - Details: trainNumber, trainName, source, destination, duration, occupancy
  - Route array with station codes/names
  - AI insights via generateAIInsights()
- Uses Rajdhani Express as hardcoded example

### lib/aiInsights.ts
- `generateAIInsights(metrics: TrainMetrics)` → AIInsightResult
- **Risk Score Calculation**:
  - Base: 0
  - Add: delay * 1.5
  - Add: 20 if speed < 40 km/h
  - Add: 10 if route has > 15 stations
  - Add: 15 if occupancy > 85%
  - Clamp to 0-100
- **Severity Mapping**:
  - 75+ → Critical
  - 50-74 → High
  - 25-49 → Moderate
  - <25 → Low
- Generates context-specific recommendations based on metrics

### lib/groq.ts
- Initializes Groq client with API key from environment
- Exports singleton groq instance

### lib/supabase.ts
- Initializes Supabase client with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- `saveSearch(query, queryType)` → Inserts into search_history table
- `getRecentSearches()` → Queries search_history, ordered by created_at DESC, limit 5
- Returns empty array on error

## Database Structure

### Supabase - search_history Table
**Columns**:
- `id` (bigint, primary key, auto-increment)
- `query` (text) - The search query string
- `query_type` (text) - "pnr" | "train" | "station" | "general"
- `created_at` (timestamp) - Auto-set to now() on insert

**Indexes**: None specified yet (consider adding on created_at for performance)

**Note**: Table must be created manually in Supabase dashboard

## Environment Variables Used

**Required in .env.local**:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, safe to expose)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, safe to expose)
- `GROQ_API_KEY` - Groq API key for LLaMA model (secret, server-side only)
- `GROQ_API_KEY_BACKUP` - Backup Groq API key (currently unused)

## Current UI Systems

### Design System
- **Theme**: Dark mode with purple accent
- **Font**: Inter (weights: 400, 500, 600, 700, 800)
- **CSS Variables**:
  - `--bg`: #08090c (main background)
  - `--surface`: #111318 (cards, sections)
  - `--surface2`: #171a21 (input backgrounds)
  - `--accent`: #7c5cff (primary purple)
  - `--accent2`: #5b3df5 (darker purple hover)
  - `--green`: #22c55e (status live)
  - `--text`: #f5f7fa (main text)
  - `--muted`: #8b93a7 (secondary text)

### Cards & Containers
- **rt-train-card**: Gradient background, backdrop blur, shadow, rounded 32px
- **rt-ai-card**: Purple gradient background, AI-themed styling
- **rt-metric-card**: Smooth hover transform, gradient fill, rounded 24px
- **rt-route-card**: Station list container with gradient lines between stops
- **rt-recent-card**: Recent searches list
- **rt-grid**: Auto-fit grid for train details (220px min)
- **rt-metrics-grid**: Auto-fit grid for metrics cards

### Badges & Pills
- **rt-status-pill**: 
  - `.live` - Green with rgba(34,197,94,...)
  - `.delayed` - Yellow with rgba(251,191,36,...)
  - `.cancelled` - Red with rgba(239,68,68,...)
  - `.arrived` - Blue with rgba(59,130,246,...)
- **rt-query-type**: Purple-tinted badge showing detected type
- **rt-ai-tags**: Tag pills with labels (Realtime, Smart Analysis, Railway AI)

### Buttons & Interactions
- **rt-search-box button**: Purple background, hover to darker purple, 68px height
- **rt-voice-btn**: 68x68 px gradient purple button with mic emoji, scale on hover
- **rt-recent-item**: Clickable history item, translateX on hover

### Loaders & Animations
- **LoadingSkeleton**: 
  - rt-skeleton-lg (220px height)
  - rt-skeleton-grid (auto-fit 220px cols)
  - rt-skeleton-card (120px height)
  - rt-skeleton-line (50px height)
  - Shimmer animation: linear gradient sweep left-to-right, 1.5s loop
- **TypingIndicator**: 
  - Three dots (10px circles)
  - Bounce animation, 1.4s loop, staggered delays
  - Purple accent color
- **Chat Bubbles**: fadeUp animation on mount (0.3s ease)

### Typography & Spacing
- Hero h1: clamp(48px, 8vw, 88px), letter-spacing: -4px
- Train card h2: 32px
- Route card h3: 24px
- Search input: 18px, 68px height
- Metric cards: 30px font-size for numbers
- Responsive breakpoint: 768px max

### Responsive Design
- **Mobile (< 768px)**:
  - Navbar flex-direction column
  - Search box flex-direction column
  - Hero h1 letter-spacing reduced
  - Train top flex-direction column

## Important Existing Logic

### Query Type Detection
- **Implemented in**: lib/utils.ts
- **Logic**: Regex patterns for PNR (10 digits), train (4-5 digits), station (2-5 letters)
- **Impact**: Determines which API handler processes the request
- **⚠️ Future Optimization**: If railway codes change format, update regex patterns here

### Train Status Color Mapping
- **Implemented in**: lib/utils.ts `getStatusColor()`
- **Used by**: SearchBox to apply CSS class to status pill
- **Colors**: Live (green), Delayed (yellow), Cancelled (red), Arrived (blue), Default (gray)
- **⚠️ Note**: Status detection is case-insensitive substring matching

### AI Risk Scoring Algorithm
- **Implemented in**: lib/aiInsights.ts `generateAIInsights()`
- **Factors**:
  - Delay contribution: delay * 1.5 (primary factor)
  - Speed check: +20 if < 40 km/h
  - Route length: +10 if > 15 stations
  - Occupancy: +15 if > 85%
- **Output**: Risk score 0-100, severity level, recommendations
- **⚠️ Hardcoded Thresholds**: Consider environment-based configuration for future

### Voice Search Integration
- **Browser API**: Web Speech API (SpeechRecognition)
- **Locale**: en-IN (Indian English)
- **Fallback**: Alert if not supported
- **⚠️ Browser Support**: Check for webkit prefix on older browsers
- **⚠️ Limitations**: Works only on HTTPS (or localhost), requires user gesture

### Search History Persistence
- **Storage**: Supabase PostgreSQL search_history table
- **Trigger**: Saved immediately after search button click
- **Retrieval**: On component mount, limit 5 records
- **Scope**: Not user-specific (public database, no auth)
- **⚠️ Warning**: All searches are public - add auth/filtering before production

### AI Conversation Context
- **Pattern**: Full message history passed to every request
- **Array**: Maintained in SearchBox state as messages[]
- **Structure**: [{ role: "user|assistant", content: "..." }]
- **System Prompt**: Groq request includes hardcoded system message defining RailTrace AI
- **⚠️ Memory Growth**: No cleanup/trimming of old messages - could grow unbounded

## Current Problems / TODO

### Incomplete/Stub APIs
- ❌ `/api/train` - Empty stub, needs train data aggregation
- ❌ `/api/station` - Empty stub, needs station search logic
- These are placeholders for future integration with real railway APIs

### Missing Features
- ❌ Real railway API integration (currently using mock Rajdhani data)
- ❌ PNR lookup implementation
- ❌ Station schedule search
- ❌ User authentication/login system
- ❌ User-specific search history (public for all users)
- ❌ Favorites or bookmarks
- ❌ Train fare estimation
- ❌ Multi-language support

### Empty Directories (Future Expansion)
- `/src/types` - No custom TypeScript types yet
- `/src/hooks` - No custom React hooks yet
- `/src/services` - No service abstractions yet
- `/src/styles` - No additional stylesheets yet

### UI/UX Gaps
- ⚠️ No error boundaries - crashes propagate to white screen
- ⚠️ No error toast notifications for failed API calls
- ⚠️ Limited input validation on search box
- ⚠️ Voice search error handling is basic (alert only)

### Performance Concerns
- ⚠️ All components use "use client" - no server-side rendering optimization
- ⚠️ Message history unbounded - could cause performance issues in long conversations
- ⚠️ No pagination for search history (limited to 5 records as workaround)

### Deployment/Infrastructure
- ⚠️ Mock train data hardcoded - needs real API data source
- ⚠️ Groq API key exposed in requests (server-side only, but consider rate limiting)
- ⚠️ Supabase search_history table must be created manually

## Development Notes

### Architectural Warnings
1. **Query Detection Centralized**: All query type logic in lib/utils.ts - keep synchronized with API handlers
2. **Hardcoded System Prompt**: LLaMA system prompt in /api/ai/route.ts - extract to constants if expanding
3. **Mock Data Limitation**: getTrainData() returns same Rajdhani data for any train number - will mislead users
4. **Supabase Public**: search_history table has no authentication - add user_id column before production
5. **Message History Growth**: SearchBox stores all messages in state - consider implementing context window limits
6. **Risk Calculation**: Algorithm in aiInsights.ts is non-configurable - parameterize thresholds for A/B testing

### Component Considerations
- SearchBox is a fat component - orchestrates search, AI, history, voice, UI state
  - Consider extracting into custom hook for logic separation
- All components are client components - potential for SSR optimization
- No shared context/provider pattern yet - fine for single-page, but plan for scale

### Database Considerations
- search_history table has no user isolation - add user_id + RLS policies
- created_at indexed for performance improvement
- Consider partitioning if volume grows significantly
- Backup strategy needed before production

### Security Notes
- GROQ_API_KEY is server-side only (good)
- Supabase anon key is public (expected for SPA)
- No rate limiting on /api/ai endpoint - add before production
- No input sanitization on search query - add validation

### Testing Gaps
- No unit tests for utility functions (detectQueryType, getStatusColor, generateAIInsights)
- No E2E tests for search flow
- No mocking strategy for Groq API

### Future Architecture Improvements
1. Extract API handlers to separate service files
2. Create TypeScript interfaces in /src/types for all data models
3. Implement custom hooks for search logic, AI conversation, voice recognition
4. Add error boundary wrapper component
5. Implement context/provider for app-level state (theme, user preferences)
6. Add logging/monitoring for AI response quality
7. Create test suite for risk scoring algorithm
