import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { services, stylists } from '../data/salonData';

const RankingScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Servicios premium</Text>
      <Text style={styles.subtitle}>Todo lo que necesitas para renovar tu estilo.</Text>

      <View style={styles.list}>
        {services.map((service) => (
          <View key={service.id} style={styles.card}>
            <Text style={styles.cardTitle}>{service.name}</Text>
            <Text style={styles.cardMeta}>
              {service.duration} · {service.price}
            </Text>
            <Text style={styles.cardText}>{service.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.teamSection}>
        <Text style={styles.sectionTitle}>Nuestro equipo</Text>
        {stylists.map((stylist) => (
          <View key={stylist.id} style={styles.teamCard}>
            <View>
              <Text style={styles.teamName}>{stylist.name}</Text>
              <Text style={styles.teamText}>{stylist.specialties}</Text>
            </View>
            <Text style={styles.teamRating}>★ {stylist.rating}</Text>
          </View>
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
  cardTitle: {
    color: '#2a1e1a',
    fontWeight: '600'
  },
  cardMeta: {
    color: '#a1847e',
    marginTop: 6
  },
  cardText: {
    color: '#6e5c57',
    marginTop: 8,
    lineHeight: 20
  },
  teamSection: {
    marginTop: 16,
    gap: 12
  },
  sectionTitle: {
    color: '#2a1e1a',
    fontSize: 18,
    fontWeight: '600'
  },
  teamCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0dcd6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  teamName: {
    color: '#2a1e1a',
    fontWeight: '600'
  },
  teamText: {
    color: '#6e5c57',
    marginTop: 4
  },
  teamRating: {
    color: '#d97c7c',
    fontWeight: '700'
  }
});

export default RankingScreen;
