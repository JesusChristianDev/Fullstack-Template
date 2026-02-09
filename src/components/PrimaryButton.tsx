import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

const PrimaryButton = ({ label, onPress, disabled, variant = 'primary' }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, variant === 'secondary' && styles.secondary, disabled && styles.disabled]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#d97c7c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#d97c7c',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  secondary: {
    backgroundColor: '#f0dcd6'
  },
  disabled: {
    opacity: 0.4
  },
  text: {
    color: '#2a1e1a',
    fontWeight: '600',
    fontSize: 16
  }
});

export default PrimaryButton;
