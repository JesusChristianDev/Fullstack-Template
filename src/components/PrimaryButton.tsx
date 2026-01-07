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
    backgroundColor: '#7c4dff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c4dff',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  secondary: {
    backgroundColor: '#232338'
  },
  disabled: {
    opacity: 0.4
  },
  text: {
    color: '#f5f5f7',
    fontWeight: '600',
    fontSize: 16
  }
});

export default PrimaryButton;
