import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { availableDates, services, stylists, timeSlots } from '../data/salonData';

const DuelsScreen = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const isReady = selectedService && selectedStylist && selectedDate && selectedTime;

  const handleConfirm = () => {
    if (!isReady) return;
    navigation.navigate(
      'Confirmation' as never,
      {
        reservation: {
          service: selectedService,
          stylist: selectedStylist,
          date: selectedDate,
          time: selectedTime,
          notes
        }
      } as never
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reserva tu cita</Text>
      <Text style={styles.subtitle}>Selecciona el servicio ideal y el horario perfecto.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicio</Text>
        <View style={styles.cards}>
          {services.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => setSelectedService(service.name)}
              style={[styles.card, selectedService === service.name && styles.cardActive]}
            >
              <Text style={styles.cardTitle}>{service.name}</Text>
              <Text style={styles.cardMeta}>
                {service.duration} · {service.price}
              </Text>
              <Text style={styles.cardText}>{service.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estilista</Text>
        <View style={styles.chips}>
          {stylists.map((stylist) => (
            <Pressable
              key={stylist.id}
              onPress={() => setSelectedStylist(stylist.name)}
              style={[styles.chip, selectedStylist === stylist.name && styles.chipActive]}
            >
              <Text style={styles.chipTitle}>{stylist.name}</Text>
              <Text style={styles.chipText}>{stylist.specialties}</Text>
              <Text style={styles.chipRating}>★ {stylist.rating}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha</Text>
        <View style={styles.rowChips}>
          {availableDates.map((date) => (
            <Pressable
              key={date.id}
              onPress={() => setSelectedDate(date.label)}
              style={[styles.pill, selectedDate === date.label && styles.pillActive]}
            >
              <Text style={styles.pillText}>{date.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hora</Text>
        <View style={styles.rowChips}>
          {timeSlots.map((slot) => (
            <Pressable
              key={slot}
              onPress={() => setSelectedTime(slot)}
              style={[styles.pill, selectedTime === slot && styles.pillActive]}
            >
              <Text style={styles.pillText}>{slot}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas adicionales</Text>
        <TextInput
          placeholder="Ej: quiero flequillo y tratamiento hidratante."
          placeholderTextColor="#a1938f"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          multiline
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumen rápido</Text>
        <Text style={styles.summaryText}>Servicio: {selectedService ?? 'Selecciona un servicio'}</Text>
        <Text style={styles.summaryText}>Estilista: {selectedStylist ?? 'Elige a tu favorita'}</Text>
        <Text style={styles.summaryText}>Fecha: {selectedDate ?? 'Define una fecha'}</Text>
        <Text style={styles.summaryText}>Hora: {selectedTime ?? 'Escoge un horario'}</Text>
      </View>

      <PrimaryButton label="Confirmar reserva" onPress={handleConfirm} disabled={!isReady} />
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
  section: {
    marginTop: 10
  },
  sectionTitle: {
    color: '#2a1e1a',
    marginBottom: 12,
    fontWeight: '600'
  },
  cards: {
    gap: 12
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0dcd6'
  },
  cardActive: {
    borderColor: '#d97c7c',
    shadowColor: '#d97c7c',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
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
  chips: {
    gap: 12
  },
  chip: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0dcd6'
  },
  chipActive: {
    borderColor: '#d97c7c'
  },
  chipTitle: {
    color: '#2a1e1a',
    fontWeight: '600'
  },
  chipText: {
    color: '#6e5c57',
    marginTop: 4
  },
  chipRating: {
    color: '#d97c7c',
    marginTop: 6,
    fontWeight: '600'
  },
  rowChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  pill: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f0dcd6'
  },
  pillActive: {
    borderColor: '#d97c7c'
  },
  pillText: {
    color: '#4b3a36'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#4b3a36',
    borderWidth: 1,
    borderColor: '#f0dcd6',
    minHeight: 90,
    textAlignVertical: 'top'
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0dcd6'
  },
  summaryTitle: {
    color: '#2a1e1a',
    fontWeight: '600',
    marginBottom: 8
  },
  summaryText: {
    color: '#6e5c57',
    marginTop: 4
  }
});

export default DuelsScreen;
