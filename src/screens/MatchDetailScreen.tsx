import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const MatchDetailScreen = () => {
  const route = useRoute();
  const { match } = route.params as { match: any };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Detalle de partida</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Jugadores</Text>
        <Text style={styles.value}>
          {match.player_a.slice(0, 6)} vs {match.player_b.slice(0, 6)}
        </Text>
        <Text style={styles.label}>Ganador</Text>
        <Text style={styles.value}>{match.winner.slice(0, 6)}</Text>
        <Text style={styles.label}>Modo</Text>
        <Text style={styles.value}>{match.mode}</Text>
        <Text style={styles.label}>Reglas</Text>
        <Text style={styles.value}>{JSON.stringify(match.rules)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Equipo A</Text>
        {match.team_a?.map((member: any) => (
          <Text key={member.id} style={styles.value}>
            {member.name}
          </Text>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Equipo B</Text>
        {match.team_b?.map((member: any) => (
          <Text key={member.id} style={styles.value}>
            {member.name}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b10'
  },
  content: {
    padding: 24,
    gap: 16
  },
  title: {
    color: '#f5f5f7',
    fontSize: 24,
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#141420',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f2e'
  },
  label: {
    color: '#7c4dff',
    marginTop: 8
  },
  value: {
    color: '#f5f5f7',
    marginTop: 4
  }
});

export default MatchDetailScreen;
