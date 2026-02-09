import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reservation } = route.params as {
    reservation: {
      service: string;
      stylist: string;
      date: string;
      time: string;
      notes?: string;
    };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reserva confirmada</Text>
      <Text style={styles.subtitle}>¡Listo! Te esperamos en Luna Hair Studio.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>{reservation.service}</Text>
        <Text style={styles.label}>Estilista</Text>
        <Text style={styles.value}>{reservation.stylist}</Text>
        <Text style={styles.label}>Fecha y hora</Text>
        <Text style={styles.value}>
          {reservation.date} · {reservation.time}
        </Text>
        <Text style={styles.label}>Notas</Text>
        <Text style={styles.value}>{reservation.notes?.trim() ? reservation.notes : 'Sin notas adicionales.'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tips previos</Text>
        <Text style={styles.value}>• Llega 10 minutos antes para una consulta express.</Text>
        <Text style={styles.value}>• Puedes modificar la cita hasta 24h antes.</Text>
        <Text style={styles.value}>• Guarda este resumen para tu visita.</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Nueva reserva" onPress={() => navigation.navigate('Booking' as never)} />
        <PrimaryButton label="Ver agenda" onPress={() => navigation.navigate('Agenda' as never)} variant="secondary" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f1ee'
  },
  content: {
    padding: 24,
    gap: 16
  },
  title: {
    color: '#2a1e1a',
    fontSize: 26,
    fontWeight: '700'
  },
  subtitle: {
    color: '#6e5c57'
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0dcd6',
    gap: 6
  },
  label: {
    color: '#d97c7c',
    marginTop: 6,
    fontWeight: '600'
  },
  value: {
    color: '#4b3a36'
  },
  actions: {
    gap: 12,
    marginTop: 8
  }
});

export default ResultScreen;
