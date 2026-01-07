import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchPlayerStats } from '../supabase/queries';

const leagueId = process.env.EXPO_PUBLIC_LEAGUE_ID ?? '';

const RankingScreen = () => {
  const { data: stats } = useQuery({
    queryKey: ['player-stats', leagueId],
    queryFn: () => fetchPlayerStats(leagueId),
    enabled: Boolean(leagueId)
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <View style={styles.list}>
        {stats?.map((stat, index) => {
          const winrate = stat.games ? Math.round((stat.wins / stat.games) * 100) : 0;
          return (
            <View key={stat.user_id} style={styles.card}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{stat.user_id.slice(0, 6)}</Text>
                <Text style={styles.muted}>
                  {stat.wins}W / {stat.losses}L · {winrate}% WR
                </Text>
              </View>
              <Text style={styles.elo}>{stat.elo}</Text>
            </View>
          );
        })}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1f1f2e'
  },
  rank: {
    color: '#7c4dff',
    fontWeight: '700'
  },
  info: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    color: '#f5f5f7',
    fontWeight: '600'
  },
  muted: {
    color: '#9aa0a6',
    marginTop: 4
  },
  elo: {
    color: '#f5f5f7',
    fontSize: 18,
    fontWeight: '700'
  }
});

export default RankingScreen;
