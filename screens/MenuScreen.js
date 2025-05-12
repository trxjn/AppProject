import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }) {
  const handleNewGame = () => {
    navigation.replace('SudokuGame'); // Start a new game
  };

  const handleContinue = () => {
    navigation.replace('SudokuGame'); // Continue where the user left off
  };

  const handleProfile = () => {
    navigation.navigate('Profile'); // Navigate to profile screen
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Sudoku!</Text>
        <Text style={styles.subtitle}>Ready to play?</Text>

        <View style={styles.buttonWrapper}>
          <Button title="New Game" color="#2a9d8f" onPress={handleNewGame} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Continue" color="#264653" onPress={handleContinue} />
        </View>

        {/* Profile Button */}
        <View style={styles.buttonWrapper}>
          <Button title="Profile" color="#e76f51" onPress={handleProfile} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8', padding: 20 },
  container: { width: '100%', maxWidth: 400, padding: 20, borderRadius: 10, backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 10, color: '#264653' },
  subtitle: { fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#264653' },
  buttonWrapper: { marginTop: 20 },
});
