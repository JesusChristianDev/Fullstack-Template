import type { MatchRules, PlayerStats } from '../types';
import { supabase } from './client';

export const checkAllowlist = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('allowlist_emails')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (error) return false;
  return Boolean(data?.email);
};

export const ensureMembership = async (leagueId: string): Promise<void> => {
  const { error } = await supabase.rpc('ensure_membership', { league_id: leagueId });
  if (error) throw error;
};

export const fetchPlayerStats = async (leagueId: string): Promise<PlayerStats[]> => {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('league_id', leagueId)
    .order('elo', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const fetchMatches = async (leagueId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('league_id', leagueId)
    .order('played_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const recordMatch = async (params: {
  leagueId: string;
  playerA: string;
  playerB: string;
  winner: string;
  teamA: unknown;
  teamB: unknown;
  mode: string;
  rules: MatchRules;
}) => {
  const { data, error } = await supabase.rpc('record_match', {
    league_id: params.leagueId,
    player_a: params.playerA,
    player_b: params.playerB,
    winner: params.winner,
    team_a: params.teamA,
    team_b: params.teamB,
    mode: params.mode,
    rules: params.rules
  });

  if (error) throw error;
  return data?.[0];
};
