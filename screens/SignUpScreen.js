import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth } from 'firebase/app'; // Import the Firebase authentication object
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import the auth method

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      navigation.replace('Menu');
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleGuestLogin = () => {
    navigation.replace('Menu');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.logo}>🧩</Text>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonWrapper}>
          <Button title="Sign Up" color="#2a9d8f" onPress={handleSignUp} />
        </View>

        {isLoading && (
          <ActivityIndicator size="large" color="#2a9d8f" style={styles.spinner} />
        )}

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Already have an account? Login
        </Text>

        <Text style={styles.link} onPress={handleGuestLogin}>
          Play as Guest
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8', padding: 20 },
  container: { width: '100%', maxWidth: 400, padding: 20, borderRadius: 10, backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, color: '#264653' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 },
  buttonWrapper: { marginTop: 10, marginBottom: 10 },
  link: { marginTop: 10, color: '#2a9d8f', textAlign: 'center' },
  spinner: { marginTop: 20 },
});
