# Jump Force Companion - Architecture

## Frontend Architecture
**Stack**: Expo + React Native + TypeScript + React Navigation (stack + tabs) + Zustand + TanStack Query + Reanimated + Moti + Expo Haptics.

**Key flows**:
- **Auth gating**: Supabase Auth login/register → `ensure_membership` RPC → allowlist check → non-allowlisted users get `Acceso no autorizado`.
- **Duelos**: Select player A/B, mode, toggles, generate teams via engine.
- **Resultado**: View team cards, lock per slot, reroll A/B/both, smart swap, record match via RPC.
- **Ranking/Historial**: TanStack Query for stats and matches.

## File/Folder Layout (major)
- `App.tsx` — app bootstrap, providers, navigation.
- `src/navigation/RootNavigator.tsx` — stack + tabs.
- `src/screens/` — Auth, Duels, Result, Ranking, History, Match detail.
- `src/engine/` — team generation (random + increíbles), scoring, constraints.
- `src/engine/tagMapping.ts` — canonical tag mapping (documented here and in README).
- `src/state/useAppStore.ts` — Zustand store (rules, locks, recent matches).
- `src/supabase/` — client and RPC/query helpers.
- `src/utils/elo.ts` — ELO math (K=24).
- `tests/` — unit tests for ELO and scoring.
- `supabase/schema.sql` — SQL, RLS, and RPC.
- `assets/data/characters.json` — roster source of truth.

## Team Engine Summary
- **Random**: 3 random per player, optional no-duplicates between A/B, avoid repeating exact team in last 3 matches (anti-repeat rule).
- **Increíbles**: Score by canonical tags (entry + lockdown + damage core), bonuses for beam/pressure, diversity, and light penalties for recent repeats. Uses top-K shortlist to avoid O(n^3) explosion.
- **Balance**: maximize `min(scoreA, scoreB) - w * |scoreA - scoreB|` with w=0.5.

## Supabase SQL + RLS + RPC
Full SQL is in `supabase/schema.sql` (tables, RLS, functions). Overview:
- **Allowlist** enforced by RLS using `allowlist_emails`.
- **Lazy membership** via `ensure_membership()` RPC at app launch.
- **record_match** RPC inserts match and updates ELO in a transaction.
