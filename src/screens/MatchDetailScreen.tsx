import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const MatchDetailScreen = () => {
  const route = useRoute();
  const { appointment } = route.params as {
    appointment: {
      service: string;
      stylist: string;
      date: string;
      time: string;
      status: string;
    };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Detalle de la reserva</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>{appointment.service}</Text>
        <Text style={styles.label}>Estilista</Text>
        <Text style={styles.value}>{appointment.stylist}</Text>
        <Text style={styles.label}>Fecha y hora</Text>
        <Text style={styles.value}>
          {appointment.date} · {appointment.time}
        </Text>
        <Text style={styles.label}>Estado</Text>
        <Text style={styles.value}>{appointment.status}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Recomendaciones</Text>
        <Text style={styles.value}>• Trae una referencia del look que deseas.</Text>
        <Text style={styles.value}>• Puedes añadir tratamientos extra al llegar.</Text>
        <Text style={styles.value}>• Escríbenos si necesitas mover la cita.</Text>
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
  }
});

export default MatchDetailScreen;
