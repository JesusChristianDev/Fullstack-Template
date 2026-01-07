# Jump Force Companion

Jump Force Companion es una app móvil privada para 3 amigos que juegan 1vs1. Genera equipos de 3 personajes para cada jugador en modo **Random** o **Increíbles** (sinergia), guarda historial, y calcula ranking con ELO.

## Asunciones
- Se usa una única liga privada creada con `bootstrap_league`.
- `w = 0.5` para el balance A vs B en el modo Increíbles.
- Anti-repetición: **no repetir el mismo equipo exacto en las últimas N=3 partidas**.

## Stack
- Expo + React Native + TypeScript
- React Navigation (stack + tabs)
- Zustand + TanStack Query
- Reanimated + Gesture Handler + Moti
- Supabase (Auth + Postgres + RLS + RPC)

## Setup
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` con:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   EXPO_PUBLIC_LEAGUE_ID=...
   ```
3. Inicia la app:
   ```bash
   npm start
   ```

## Supabase
1. Ejecuta el SQL de `supabase/schema.sql` en tu proyecto Supabase.
2. Crea la liga:
   ```sql
   select public.bootstrap_league('Jump Force League', array['a@demo.com','b@demo.com','c@demo.com']);
   ```
   Guarda el `league_id` y ponlo en `.env`.
3. Los usuarios allowlisted se añaden automáticamente via `ensure_membership()` al abrir la app.

## Motor de equipos
### Tags canon
`entry`, `lockdown`, `beam`, `damage`, `pressure`, `mobility`

### Mapeo de tags extendidas
- `projectile` → `beam` (beam-lite)
- `control` → `lockdown-lite`
- `setup` → `lockdown-lite`
- `trap` → `lockdown-lite` + `pressure-lite`
- `counter` → `lockdown-lite`
- `tank` → `pressure-lite`
- `utility` → neutral (pequeño bonus de balance)

El mapeo vive en `src/engine/tagMapping.ts` y es utilizado por el scoring.

### Increíbles (scoring)
- Objetivo: `entry + lockdown + damage`.
- Bonus por `beam` y `pressure`.
- Bonus por diversidad de roles y archetypes.
- Penaliza repetición reciente.
- Performance: se toma un **shortlist top K (12)** por score individual para limitar combinaciones.

### Random
- 3 random para A y B.
- No repetir entre A/B (toggle).
- Anti-repetición en últimas 3 partidas.

### Lock / Reroll / Swap
- Lock por slot.
- Reroll respeta locks y restricciones.
- Swap inteligente elige el mejor candidato según scoring (no random).

## Tests
- `tests/elo.test.ts` — cálculo de ELO.
- `tests/scoring.test.ts` — scoring del modo Increíbles.

## Roster
Fuente de verdad: `assets/data/characters.json`. Para ampliar el roster, añade personajes respetando el schema y tags; el motor los consume automáticamente.

## Mejoras priorizadas
1. Avatares por jugador y selección por nombre real.
2. Pantalla de analytics con gráficos de winrate y evolución ELO.
3. Sistema de favoritos y veto de personajes.
4. Caché local offline para historial.
5. Modo torneo con bracket.
