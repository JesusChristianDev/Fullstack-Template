export const services = [
  {
    id: 'corte-peinado',
    name: 'Corte y peinado',
    duration: '45 min',
    price: '€28',
    description: 'Corte personalizado con lavado, secado y acabado.'
  },
  {
    id: 'color-brillo',
    name: 'Color y brillo',
    duration: '90 min',
    price: '€65',
    description: 'Coloración completa con tratamiento nutritivo.'
  },
  {
    id: 'balayage',
    name: 'Balayage natural',
    duration: '120 min',
    price: '€95',
    description: 'Mechas suaves para iluminar sin perder naturalidad.'
  },
  {
    id: 'tratamiento',
    name: 'Tratamiento reparador',
    duration: '60 min',
    price: '€42',
    description: 'Hidratación profunda con masaje capilar.'
  }
];

export const stylists = [
  {
    id: 'alma',
    name: 'Alma García',
    specialties: 'Corte moderno · Barbería suave',
    rating: '4.9'
  },
  {
    id: 'sofia',
    name: 'Sofía Martín',
    specialties: 'Coloración · Balayage',
    rating: '5.0'
  },
  {
    id: 'lucia',
    name: 'Lucía Navarro',
    specialties: 'Tratamientos · Peinados',
    rating: '4.8'
  }
];

export const availableDates = [
  {
    id: 'mar-12',
    label: 'Mar, 12 Mar'
  },
  {
    id: 'mie-13',
    label: 'Mié, 13 Mar'
  },
  {
    id: 'jue-14',
    label: 'Jue, 14 Mar'
  },
  {
    id: 'vie-15',
    label: 'Vie, 15 Mar'
  }
];

export const timeSlots = ['09:30', '11:00', '12:30', '15:00', '17:30', '19:00'];

export const upcomingAppointments = [
  {
    id: 'res-204',
    service: 'Corte y peinado',
    stylist: 'Alma García',
    date: 'Mar, 12 Mar',
    time: '11:00',
    status: 'Confirmada'
  },
  {
    id: 'res-205',
    service: 'Color y brillo',
    stylist: 'Sofía Martín',
    date: 'Vie, 15 Mar',
    time: '17:30',
    status: 'Pendiente'
  }
];
