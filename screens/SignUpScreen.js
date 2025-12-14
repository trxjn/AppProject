import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase'; // Import db
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
// Import Firestore functions
import { doc, setDoc, updateDoc, arrayUnion, addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function SignUpScreen({ navigation, route }) { // Add route prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  // Check if a score was passed from the game
  const scoreToSave = route.params?.score;

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create User Document
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        scores: scoreToSave ? [scoreToSave] : [] // Initialize with score if present
      });

      // If there is a pending score, save to Global Leaderboard too
      if (scoreToSave) {
        await addDoc(collection(db, "leaderboard"), {
          email: user.email,
          time: scoreToSave,
          date: serverTimestamp()
        });
        Alert.alert('Success', 'Account created and your score was saved! 🏆');
      } else {
        Alert.alert('Success', 'Account created!');
      }

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

        {scoreToSave && (
          <View style={styles.scoreAlert}>
            <Text style={styles.scoreText}>
              Sign up now to save your time of {scoreToSave}s!
            </Text>
          </View>
        )}

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
          <Button title="Sign Up & Save" color="#2a9d8f" onPress={handleSignUp} />
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
  scoreAlert: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c3e6cb'
  },
  scoreText: {
    color: '#155724',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});