import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [topScores, setTopScores] = useState([100, 95, 90, 85, 80, 75, 70, 65, 60, 55]); // Sample top scores
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Flag to check if user is logged in (or guest)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri); // Update the profile image
    }
  };

  const handleSignUpPrompt = () => {
    Alert.alert('Create Account', 'Please sign up to set a profile and track your scores.');
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.screen}>
      {isLoggedIn ? (
        <>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your Email: user@example.com</Text>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <Text>No profile image</Text>
          )}

          <Button title="Upload Profile Image" color="#2a9d8f" onPress={pickImage} />

          <Text style={styles.subtitle}>Top 10 Scores:</Text>
          <View style={styles.scores}>
            {topScores.length ? (
              topScores.map((score, index) => (
                <Text key={index} style={styles.scoreText}>{`#${index + 1}: ${score}`}</Text>
              ))
            ) : (
              <Text>No scores available</Text>
            )}
          </View>
        </>
      ) : (
        <View>
          <Text style={styles.title}>Guest User</Text>
          <Text>You are logged in as a guest. Please sign up to set a profile and track your scores.</Text>
          <Button title="Create Account" onPress={handleSignUpPrompt} color="#e76f51" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8', padding: 20 },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 20, color: '#264653' },
  subtitle: { fontSize: 20, textAlign: 'center', marginBottom: 10, color: '#264653' },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  scores: { marginTop: 20, alignItems: 'center' },
  scoreText: { fontSize: 16, color: '#264653', marginBottom: 5 },
});
