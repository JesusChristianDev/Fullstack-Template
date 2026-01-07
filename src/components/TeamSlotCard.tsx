import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

type Props = {
  name: string;
  series: string;
  locked: boolean;
  onToggleLock: () => void;
  highlight?: boolean;
};

const TeamSlotCard = ({ name, series, locked, onToggleLock, highlight }: Props) => {
  const handlePress = async () => {
    await Haptics.selectionAsync();
    onToggleLock();
  };

  return (
    <Pressable onPress={handlePress} style={[styles.card, highlight && styles.highlight]}>
      <View style={styles.textWrap}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.series}>{series}</Text>
      </View>
      <MotiView
        animate={{ rotate: locked ? '15deg' : '0deg', opacity: locked ? 1 : 0.4 }}
        transition={{ type: 'spring' }}
        style={styles.lock}
      >
        <Text style={styles.lockText}>{locked ? '🔒' : '🔓'}</Text>
      </MotiView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#141420',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1f1f2e'
  },
  highlight: {
    borderColor: '#7c4dff',
    shadowColor: '#7c4dff',
    shadowOpacity: 0.6,
    shadowRadius: 10
  },
  textWrap: {
    flex: 1
  },
  name: {
    color: '#f5f5f7',
    fontSize: 16,
    fontWeight: '600'
  },
  series: {
    color: '#9aa0a6',
    marginTop: 4
  },
  lock: {
    marginLeft: 12
  },
  lockText: {
    fontSize: 18
  }
});

export default TeamSlotCard;
