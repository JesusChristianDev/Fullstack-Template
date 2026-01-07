import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { checkAllowlist, ensureMembership } from '../supabase/queries';

export type AuthStatus = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  allowlisted: boolean;
  error: string | null;
};

const leagueId = process.env.EXPO_PUBLIC_LEAGUE_ID ?? '';

export const useAuth = (): AuthStatus => {
  const [state, setState] = useState<AuthStatus>({
    loading: true,
    userId: null,
    email: null,
    allowlisted: false,
    error: null
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          userId: session.user.id,
          email: session.user.email ?? null,
          loading: false
        }));
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          userId: session.user.id,
          email: session.user.email ?? null,
          loading: false
        }));
      } else {
        setState({ loading: false, userId: null, email: null, allowlisted: false, error: null });
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!state.email || !state.userId) return;
      const allowlisted = await checkAllowlist(state.email);
      if (!allowlisted) {
        setState((prev) => ({ ...prev, allowlisted: false }));
        return;
      }
      try {
        if (leagueId) {
          await ensureMembership(leagueId);
        }
        setState((prev) => ({ ...prev, allowlisted: true }));
      } catch (error) {
        setState((prev) => ({ ...prev, allowlisted: false, error: (error as Error).message }));
      }
    };

    run();
  }, [state.email, state.userId]);

  return state;
};
