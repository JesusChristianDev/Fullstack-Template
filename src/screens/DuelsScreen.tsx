import { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import PrimaryButton from '../components/PrimaryButton';
import { characters } from '../data/characters';
import { generateIncredibleTeams, generateRandomTeams } from '../engine/teamGenerator';
import { useAppStore } from '../state/useAppStore';
import { fetchPlayerStats } from '../supabase/queries';

const leagueId = process.env.EXPO_PUBLIC_LEAGUE_ID ?? '';

const DuelsScreen = () => {
  const navigation = useNavigation();
  const { data: stats } = useQuery({
    queryKey: ['player-stats', leagueId],
    queryFn: () => fetchPlayerStats(leagueId),
    enabled: Boolean(leagueId)
  });

  const {
    selectedPlayerA,
    selectedPlayerB,
    mode,
    rules,
    setPlayers,
    setMode,
    toggleRule,
    setTeams,
    teamA,
    teamB,
    recentTeamsA,
    recentTeamsB
  } = useAppStore();

  const members = useMemo(() => stats?.map((stat) => stat.user_id) ?? [], [stats]);

  const handleGenerate = () => {
    const options = {
      mode,
      avoidRecentTeams: rules.avoidRecentTeams,
      noDuplicatesAcrossTeams: rules.noDuplicatesAcrossTeams,
      recentTeamsA,
      recentTeamsB,
      lockedTeamA: teamA,
      lockedTeamB: teamB
    };

    const result = mode === 'random' ? generateRandomTeams(characters, options) : generateIncredibleTeams(characters, options);
    setTeams(result.teamA, result.teamB);
    navigation.navigate('Result' as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Duelos</Text>
      <Text style={styles.subtitle}>Selecciona jugadores y genera equipos</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jugador A</Text>
        <View style={styles.chips}>
          {members.map((member) => (
            <Pressable
              key={`A-${member}`}
              onPress={() => setPlayers(member, selectedPlayerB)}
              style={[styles.chip, selectedPlayerA === member && styles.chipActive]}
            >
              <Text style={styles.chipText}>{member.slice(0, 6)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jugador B</Text>
        <View style={styles.chips}>
          {members.map((member) => (
            <Pressable
              key={`B-${member}`}
              onPress={() => setPlayers(selectedPlayerA, member)}
              style={[styles.chip, selectedPlayerB === member && styles.chipActive]}
            >
              <Text style={styles.chipText}>{member.slice(0, 6)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo</Text>
        <View style={styles.chips}>
          {(['random', 'incredibles'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={[styles.chip, mode === item && styles.chipActive]}
            >
              <Text style={styles.chipText}>{item === 'random' ? 'Random' : 'Increíbles'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reglas</Text>
        <View style={styles.chips}>
          <Pressable onPress={() => toggleRule('noDuplicatesAcrossTeams')} style={[styles.chip, rules.noDuplicatesAcrossTeams && styles.chipActive]}>
            <Text style={styles.chipText}>Sin repetidos</Text>
          </Pressable>
          <Pressable onPress={() => toggleRule('avoidRecentTeams')} style={[styles.chip, rules.avoidRecentTeams && styles.chipActive]}>
            <Text style={styles.chipText}>Evitar equipos recientes</Text>
          </Pressable>
        </View>
      </View>

      <PrimaryButton
        label="GENERAR"
        onPress={handleGenerate}
        disabled={!selectedPlayerA || !selectedPlayerB || selectedPlayerA === selectedPlayerB}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b10'
  },
  content: {
    padding: 24
  },
  title: {
    color: '#f5f5f7',
    fontSize: 24,
    fontWeight: '700'
  },
  subtitle: {
    color: '#9aa0a6',
    marginTop: 8
  },
  section: {
    marginTop: 24
  },
  sectionTitle: {
    color: '#f5f5f7',
    marginBottom: 12,
    fontWeight: '600'
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  chip: {
    backgroundColor: '#141420',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f1f2e'
  },
  chipActive: {
    borderColor: '#7c4dff'
  },
  chipText: {
    color: '#f5f5f7'
  }
});

export default DuelsScreen;
