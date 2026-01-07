import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { characters } from '../data/characters';
import PrimaryButton from '../components/PrimaryButton';
import TeamSlotCard from '../components/TeamSlotCard';
import { generateIncredibleTeams, generateRandomTeams, smartSwap } from '../engine/teamGenerator';
import { mapSynergyTags, summarizeRoles } from '../engine/tagMapping';
import { useAppStore } from '../state/useAppStore';
import { recordMatch } from '../supabase/queries';
import { revealDelay } from '../utils/animations';

const leagueId = process.env.EXPO_PUBLIC_LEAGUE_ID ?? '';

const ResultScreen = () => {
  const navigation = useNavigation();
  const {
    teamA,
    teamB,
    rules,
    mode,
    recentTeamsA,
    recentTeamsB,
    selectedPlayerA,
    selectedPlayerB,
    toggleLock,
    setTeams,
    registerMatch
  } = useAppStore();

  const [isCalculating, setIsCalculating] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ team: 'A' | 'B'; index: number } | null>(null);

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => setIsCalculating(false), revealDelay());
    return () => clearTimeout(timer);
  }, [mode, teamA, teamB]);

  const summary = useMemo(() => {
    if (mode !== 'incredibles') return null;
    const weights = teamA.flatMap((slot) => mapSynergyTags(slot.character.heuristics.synergy_tags));
    return summarizeRoles(weights);
  }, [mode, teamA]);

  const handleReroll = (target: 'A' | 'B' | 'both') => {
    const options = {
      mode,
      avoidRecentTeams: rules.avoidRecentTeams,
      noDuplicatesAcrossTeams: rules.noDuplicatesAcrossTeams,
      recentTeamsA,
      recentTeamsB,
      lockedTeamA: target !== 'B' ? teamA : undefined,
      lockedTeamB: target !== 'A' ? teamB : undefined
    };

    const result = mode === 'random' ? generateRandomTeams(characters, options) : generateIncredibleTeams(characters, options);
    setTeams(target === 'B' ? teamA.map((slot) => slot.character) : result.teamA, target === 'A' ? teamB.map((slot) => slot.character) : result.teamB);
  };

  const handleSwap = async () => {
    if (!selectedSlot) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSlot.team === 'A') {
      const next = smartSwap(
        teamA.map((slot) => slot.character),
        selectedSlot.index,
        characters,
        {
          recentTeams: recentTeamsA,
          noDuplicates: rules.noDuplicatesAcrossTeams,
          otherTeam: teamB.map((slot) => slot.character)
        }
      );
      setTeams(next, teamB.map((slot) => slot.character));
    } else {
      const next = smartSwap(
        teamB.map((slot) => slot.character),
        selectedSlot.index,
        characters,
        {
          recentTeams: recentTeamsB,
          noDuplicates: rules.noDuplicatesAcrossTeams,
          otherTeam: teamA.map((slot) => slot.character)
        }
      );
      setTeams(teamA.map((slot) => slot.character), next);
    }
  };

  const handleRecordMatch = async (winner: 'A' | 'B') => {
    if (!selectedPlayerA || !selectedPlayerB || !leagueId) return;
    await recordMatch({
      leagueId,
      playerA: selectedPlayerA,
      playerB: selectedPlayerB,
      winner: winner === 'A' ? selectedPlayerA : selectedPlayerB,
      teamA: teamA.map((slot) => slot.character),
      teamB: teamB.map((slot) => slot.character),
      mode,
      rules
    });
    registerMatch(
      teamA.map((slot) => slot.character),
      teamB.map((slot) => slot.character)
    );
    navigation.goBack();
  };

  const renderTeam = (team: 'A' | 'B') => {
    const slots = team === 'A' ? teamA : teamB;
    return (
      <View style={styles.teamBlock}>
        <Text style={styles.teamTitle}>Equipo {team}</Text>
        <View style={styles.teamList}>
          {slots.map((slot, index) => (
            <MotiView
              key={`${team}-${slot.character.id}-${index}`}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: isCalculating ? 0 : 1, translateY: isCalculating ? 12 : 0 }}
              transition={{ delay: 80 * index, type: 'timing', duration: 280 }}
            >
              <TeamSlotCard
                name={slot.character.name}
                series={slot.character.series}
                locked={slot.locked}
                onToggleLock={() => toggleLock(team, index)}
                highlight={selectedSlot?.team === team && selectedSlot.index === index}
              />
              <Text
                style={styles.swapHint}
                onPress={() => setSelectedSlot({ team, index })}
              >
                Seleccionar para swap
              </Text>
            </MotiView>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resultado</Text>
      {isCalculating && (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 200 }}>
          <Text style={styles.calc}>Calculando sinergia...</Text>
        </MotiView>
      )}

      {!isCalculating && summary && (
        <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }}>
          <Text style={styles.incredibleTag}>✨ {summary}</Text>
        </MotiView>
      )}

      <View style={styles.teamsWrapper}>{renderTeam('A')}</View>
      <View style={styles.teamsWrapper}>{renderTeam('B')}</View>

      <View style={styles.actions}>
        <PrimaryButton label="Reroll A" onPress={() => handleReroll('A')} />
        <PrimaryButton label="Reroll B" onPress={() => handleReroll('B')} />
        <PrimaryButton label="Reroll Ambos" onPress={() => handleReroll('both')} variant="secondary" />
        <PrimaryButton label="Swap Inteligente" onPress={handleSwap} disabled={!selectedSlot} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Gana A" onPress={() => handleRecordMatch('A')} />
        <PrimaryButton label="Gana B" onPress={() => handleRecordMatch('B')} />
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
  calc: {
    color: '#9aa0a6',
    marginTop: 8
  },
  incredibleTag: {
    backgroundColor: '#1a1a2e',
    color: '#f5f5f7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start'
  },
  teamsWrapper: {
    marginTop: 12
  },
  teamBlock: {
    gap: 12
  },
  teamTitle: {
    color: '#f5f5f7',
    fontSize: 18,
    fontWeight: '600'
  },
  teamList: {
    gap: 12
  },
  swapHint: {
    color: '#7c4dff',
    marginTop: 6
  },
  actions: {
    gap: 12,
    marginTop: 12
  }
});

export default ResultScreen;
