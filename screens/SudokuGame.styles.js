import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    paddingVertical: 20,
  },

  // Main Wrapper for Side-by-Side Layout
  mainLayout: {
    flexDirection: 'row', // Horizontal by default (Web)
    flexWrap: 'wrap', // Wrap on smaller screens (Mobile)
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1000, // Limit max width for large desktops
    gap: 40, // Space between game and leaderboard
  },
  
  // Game Column
  container: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  // Leaderboard Column
  leaderboardPanel: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    height: 'fit-content', // Only take necessary height
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 20, // Add top margin if it wraps on mobile
  },

  leaderboardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#264653',
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },

  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },

  rankText: {
    fontWeight: 'bold',
    color: '#e76f51',
    width: 30,
  },
  
  leaderboardUser: {
    color: '#555',
    fontSize: 14,
  },

  leaderboardTime: {
    fontWeight: 'bold',
    color: '#2a9d8f',
  },

  noScores: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },

  guestHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },

  // ... (Existing Game Styles) ...
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e76f51',
    borderRadius: 5,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#264653',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginBottom: 5,
  },

  guestText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },

  gameContainer: {
    width: '100%',
    alignItems: 'center',
  },

  grid: {
    width: '100%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#264653',
    borderWidth: 2,
    backgroundColor: '#264653',
  },

  cell: {
    width: '11.111%',
    height: '11.111%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },

  cellRightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#264653',
  },
  cellBottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#264653',
  },

  initialCell: {
    backgroundColor: '#e9ecef', // Gray background for fixed cells
  },
  editableCell: {
    backgroundColor: '#fff',
  },
  correctCell: {
    backgroundColor: '#d4edda', // Green
  },
  errorCell: {
    backgroundColor: '#f8d7da', // Red
  },
  errorText: {
    color: '#721c24',
  },
  selectedCell: {
    backgroundColor: '#bde0fe', // Blue selection
  },
  cellText: {
    fontSize: 20,
    color: '#2a9d8f',
  },
  initialText: {
    color: '#264653',
    fontWeight: 'bold',
  },

  controls: {
    marginTop: 20,
    width: '100%',
  },

  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  numButton: {
    width: '18%', 
    aspectRatio: 1.5,
    backgroundColor: '#264653',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 5,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },

  clearButton: {
    backgroundColor: '#e76f51',
  },

  numButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  actionBtn: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e9c46a',
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },

  checkBtn: {
    backgroundColor: '#2a9d8f',
  },

  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Victory UI
  victoryContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#d4edda',
    borderRadius: 10,
    width: '100%',
  },
  victoryText: {
    fontSize: 24,
    color: '#155724',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playAgainBtn: {
    backgroundColor: '#155724',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  playAgainText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  }
});