import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthScreen from '../screens/AuthScreen';
import DuelsScreen from '../screens/DuelsScreen';
import ResultScreen from '../screens/ResultScreen';
import RankingScreen from '../screens/RankingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f6f1ee',
    card: '#ffffff',
    text: '#2a1e1a',
    border: '#f0dcd6',
    primary: '#d97c7c'
  }
};

const TabNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#ffffff', borderTopColor: '#f0dcd6' },
        tabBarActiveTintColor: '#d97c7c',
        tabBarInactiveTintColor: '#8a7a75'
      }}
    >
      <Tabs.Screen name="Booking" component={DuelsScreen} options={{ tabBarLabel: 'Reservar' }} />
      <Tabs.Screen name="Services" component={RankingScreen} options={{ tabBarLabel: 'Servicios' }} />
      <Tabs.Screen name="Agenda" component={HistoryScreen} options={{ tabBarLabel: 'Agenda' }} />
    </Tabs.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={AuthScreen} />
        <Stack.Screen name="AppTabs" component={TabNavigator} />
        <Stack.Screen name="Confirmation" component={ResultScreen} />
        <Stack.Screen name="AppointmentDetail" component={MatchDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
