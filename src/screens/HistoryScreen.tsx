import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '../supabase/queries';

const leagueId = process.env.EXPO_PUBLIC_LEAGUE_ID ?? '';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { data: matches } = useQuery({
    queryKey: ['matches', leagueId],
    queryFn: () => fetchMatches(leagueId),
    enabled: Boolean(leagueId)
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      <View style={styles.list}>
        {matches?.map((match) => (
          <Pressable
            key={match.id}
            style={styles.card}
            onPress={() => navigation.navigate('MatchDetail' as never, { match } as never)}
          >
            <Text style={styles.name}>
              {match.player_a.slice(0, 6)} vs {match.player_b.slice(0, 6)}
            </Text>
            <Text style={styles.muted}>Ganador: {match.winner.slice(0, 6)}</Text>
            <Text style={styles.muted}>Modo: {match.mode}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b10',
    padding: 24
  },
  title: {
    color: '#f5f5f7',
    fontSize: 24,
    fontWeight: '700'
  },
  list: {
    marginTop: 16,
    gap: 12
  },
  card: {
    backgroundColor: '#141420',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f2e'
  },
  name: {
    color: '#f5f5f7',
    fontWeight: '600'
  },
  muted: {
    color: '#9aa0a6',
    marginTop: 4
  }
});

export default HistoryScreen;
