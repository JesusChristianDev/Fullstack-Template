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
    background: '#0b0b10',
    card: '#141420',
    text: '#f5f5f7',
    border: '#1e1e2a',
    primary: '#7c4dff'
  }
};

const TabNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#141420', borderTopColor: '#1e1e2a' },
        tabBarActiveTintColor: '#7c4dff',
        tabBarInactiveTintColor: '#9aa0a6'
      }}
    >
      <Tabs.Screen name="Duels" component={DuelsScreen} />
      <Tabs.Screen name="Ranking" component={RankingScreen} />
      <Tabs.Screen name="History" component={HistoryScreen} />
    </Tabs.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="AppTabs" component={TabNavigator} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
