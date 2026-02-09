import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { upcomingAppointments } from '../data/salonData';

const HistoryScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Agenda</Text>
      <Text style={styles.subtitle}>Tus próximas reservas confirmadas.</Text>
      <View style={styles.list}>
        {upcomingAppointments.map((appointment) => (
          <Pressable
            key={appointment.id}
            style={styles.card}
            onPress={() => navigation.navigate('AppointmentDetail' as never, { appointment } as never)}
          >
            <Text style={styles.name}>{appointment.service}</Text>
            <Text style={styles.muted}>
              {appointment.date} · {appointment.time}
            </Text>
            <Text style={styles.muted}>Estilista: {appointment.stylist}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{appointment.status}</Text>
            </View>
          </Pressable>
        ))}
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
  list: {
    marginTop: 8,
    gap: 12
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0dcd6'
  },
  name: {
    color: '#2a1e1a',
    fontWeight: '600'
  },
  muted: {
    color: '#6e5c57',
    marginTop: 4
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7e7e4',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10
  },
  badgeText: {
    color: '#d97c7c',
    fontWeight: '600'
  }
});

export default HistoryScreen;
