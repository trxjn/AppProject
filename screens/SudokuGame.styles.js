import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  gameContainer: {
    backgroundColor: '#fff',
    width: 400, // Set a fixed width for the container
    maxWidth: 500, // Ensure it doesn't get larger than this
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  backButton: {
    position: 'absolute',  // Keeps the back button fixed on the screen
    top: 20,               // Adjust the position as needed
    left: 20,
    padding: 10,
    backgroundColor: '#ff6f61',  // Back button color
    borderRadius: 5,
    zIndex: 999,           // Ensures the button stays above other components
  },
  buttonText: {
    color: '#fff',         // White text for visibility
    fontSize: 16,
  },

  
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4A90E2',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F39C12',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  correctText: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  incorrectText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    alignItems: 'center',
  },
  cell: {
    width: '11.11%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 0,
  },
  initialCell: {
    backgroundColor: '#d3d3d3',
  },
  editableCell: {
    backgroundColor: '#fff',
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cursor: {
    fontSize: 24,
    color: '#aaa',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  numButton: {
    width: '20%',
    paddingVertical: 10,
    margin: 5,
    backgroundColor: '#2980B9',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#27ae60',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  lleaderboardContainer: {
    width: 150,
    marginLeft: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  
  leaderboardContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    elevation: 2, // Optional for subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  
  timeEntry: {
    fontSize: 16,
    marginVertical: 2,
  },
  
});

export default styles;
