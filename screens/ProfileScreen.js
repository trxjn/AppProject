import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { db, auth } from '../firebase';
// Added query, orderBy, limit, collection, getDocs for Global Leaderboard
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [personalScores, setPersonalScores] = useState([]);
  const [globalScores, setGlobalScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('global'); // 'personal' or 'global'

  useEffect(() => {
    fetchGlobalLeaderboard();
    if (user) {
      fetchPersonalData();
      setActiveTab('personal'); // Default to personal if logged in
    } else {
      setActiveTab('global'); // Default to global if guest
    }
  }, [user]);

  const fetchGlobalLeaderboard = async () => {
    try {
      // Create a reference to the global leaderboard
      const q = query(collection(db, "leaderboard"), orderBy("time", "asc"), limit(10));
      const querySnapshot = await getDocs(q);
      const scores = [];
      querySnapshot.forEach((doc) => {
        scores.push(doc.data());
      });
      setGlobalScores(scores);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchPersonalData = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.scores) {
          const sorted = data.scores.sort((a, b) => a - b).slice(0, 10);
          setPersonalScores(sorted);
        }
      }
    } catch (error) {
      console.error("Error fetching personal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Helper to hide email (john.doe@gmail.com -> john.doe)
  const formatUser = (email) => {
    if (!email) return "Anonymous";
    return email.split('@')[0];
  };

  const renderLeaderboardItem = ({ item, index }) => (
    <View style={styles.scoreRow}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{index + 1}</Text>
      </View>
      <View style={styles.infoContainer}>
        {/* If item has an email property, it's global; otherwise it's personal score (just a number) */}
        <Text style={styles.userText}>
          {typeof item === 'object' ? formatUser(item.email) : 'You'}
        </Text>
      </View>
      <Text style={styles.timeText}>
        {typeof item === 'object' ? formatTime(item.time) : formatTime(item)}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user ? user.email[0].toUpperCase() : 'G'}</Text>
        </View>
        <Text style={styles.username}>
          {user ? formatUser(user.email) : 'Guest Player'}
        </Text>
        {!user && (
          <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupText}>Sign Up to Save Progress</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {user && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'personal' && styles.activeTab]} 
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>My Best</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'global' && styles.activeTab]} 
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>Global Top 10</Text>
        </TouchableOpacity>
      </View>

      {/* List Content */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2a9d8f" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={activeTab === 'personal' ? personalScores : globalScores}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLeaderboardItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {activeTab === 'personal' 
                  ? "No games completed yet. Go play!" 
                  : "Leaderboard is loading or empty."}
              </Text>
            }
          />
        )}
      </View>

      {user ? (
        <Button title="Logout" onPress={handleLogout} color="#e76f51" />
      ) : (
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} color="#2a9d8f" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0f4f8', padding: 20, paddingTop: 50 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { 
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#264653', 
    justifyContent: 'center', alignItems: 'center', marginBottom: 10 
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  username: { fontSize: 24, fontWeight: 'bold', color: '#264653' },
  signupBtn: { marginTop: 10, backgroundColor: '#e9c46a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  signupText: { color: '#264653', fontWeight: 'bold', fontSize: 14 },
  
  tabs: { flexDirection: 'row', marginBottom: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#2a9d8f' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#fff' },
  activeTab: { backgroundColor: '#2a9d8f' },
  tabText: { color: '#2a9d8f', fontWeight: '600' },
  activeTabText: { color: '#fff' },

  listContainer: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 20, elevation: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rankContainer: { width: 40, alignItems: 'center' },
  rankText: { fontSize: 16, fontWeight: 'bold', color: '#e76f51' },
  infoContainer: { flex: 1, paddingLeft: 10 },
  userText: { fontSize: 16, color: '#264653', fontWeight: '500' },
  timeText: { fontSize: 18, fontWeight: 'bold', color: '#2a9d8f' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#888', fontStyle: 'italic' },
});