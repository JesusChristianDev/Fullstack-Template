import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { supabase } from '../supabase/client';
import { useAuth } from '../hooks/useAuth';

const AuthScreen = () => {
  const navigation = useNavigation();
  const { userId, allowlisted, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && userId && allowlisted) {
      navigation.reset({ index: 0, routes: [{ name: 'AppTabs' as never }] });
    }
  }, [allowlisted, loading, navigation, userId]);

  const handleLogin = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
  };

  const handleRegister = async () => {
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jump Force Companion</Text>
      <Text style={styles.subtitle}>Liga privada para 3 amigos</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6f7485"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6f7485"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {message ? <Text style={styles.error}>{message}</Text> : null}

      {!loading && userId && !allowlisted && (
        <Text style={styles.error}>Acceso no autorizado</Text>
      )}

      <View style={styles.actions}>
        <PrimaryButton label="Login" onPress={handleLogin} />
        <PrimaryButton label="Register" onPress={handleRegister} variant="secondary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b10',
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    color: '#f5f5f7',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center'
  },
  subtitle: {
    color: '#9aa0a6',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32
  },
  input: {
    backgroundColor: '#141420',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f5f5f7',
    marginBottom: 12
  },
  actions: {
    gap: 12,
    marginTop: 12
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center'
  }
});

export default AuthScreen;
