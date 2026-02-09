import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';

const AuthScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Luna Hair Studio</Text>
      <Text style={styles.subtitle}>Reserva tu próximo look en segundos.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu experiencia premium</Text>
        <Text style={styles.cardText}>Agenda tu cita con estilistas expertos, elige servicios y recibe confirmación inmediata.</Text>
      </View>
      <View style={styles.features}>
        <Text style={styles.feature}>• Recordatorios automáticos por WhatsApp</Text>
        <Text style={styles.feature}>• Servicios personalizados y combos</Text>
        <Text style={styles.feature}>• Horarios flexibles con prioridad VIP</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Entrar a reservas" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'AppTabs' as never }] })} />
        <PrimaryButton label="Ver servicios" onPress={() => navigation.navigate('AppTabs' as never)} variant="secondary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f1ee',
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    color: '#2a1e1a',
    fontSize: 30,
    fontWeight: '700'
  },
  subtitle: {
    color: '#6e5c57',
    marginTop: 8,
    marginBottom: 24
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f0dcd6'
  },
  cardTitle: {
    color: '#2a1e1a',
    fontWeight: '600',
    marginBottom: 6
  },
  cardText: {
    color: '#6e5c57',
    lineHeight: 20
  },
  features: {
    marginTop: 20,
    gap: 8
  },
  actions: {
    gap: 12,
    marginTop: 12
  },
  feature: {
    color: '#4b3a36'
  }
});

export default AuthScreen;
