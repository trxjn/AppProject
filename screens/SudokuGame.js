import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import SudokuStyles from './SudokuGame.styles';
import sudoku from 'sudoku';
import { useAuth } from '../hooks/useAuth'; 
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

const generatePuzzleWithSolution = () => {
  const rawPuzzle = sudoku.makepuzzle();
  const rawSolution = sudoku.solvepuzzle(rawPuzzle);

  const puzzle = [];
  const solution = [];

  for (let i = 0; i < 9; i++) {
    puzzle.push(rawPuzzle.slice(i * 9, i * 9 + 9).map(n => n === null ? 0 : n + 1));
    solution.push(rawSolution.slice(i * 9, i * 9 + 9).map(n => n === null ? 0 : n + 1));
  }

  return { puzzle, solution };
};

export default function SudokuGame({ navigation }) {
  const { user } = useAuth(); 
  const [initialPuzzle, setInitialPuzzle] = useState([]);
  const [puzzle, setPuzzle] = useState([]);
  const [solvedPuzzle, setSolvedPuzzle] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cellStatus, setCellStatus] = useState([]); 
  const [leaderboard, setLeaderboard] = useState([]); 
  const [gameWon, setGameWon] = useState(false); 

  useEffect(() => {
    startNewGame();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && !gameWon) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, gameWon]);

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, "leaderboard"), orderBy("time", "asc"), limit(10));
      const querySnapshot = await getDocs(q);
      const scores = [];
      querySnapshot.forEach((doc) => {
        scores.push(doc.data());
      });
      setLeaderboard(scores);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const startNewGame = () => {
    setLoading(true);
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzleWithSolution();
    setInitialPuzzle(newPuzzle);
    setPuzzle(JSON.parse(JSON.stringify(newPuzzle)));
    setSolvedPuzzle(newSolution);
    setCellStatus(Array(9).fill().map(() => Array(9).fill(null)));
    setTimer(0);
    setIsActive(true);
    setGameWon(false);
    setSelectedCell(null);
    setLoading(false);
    fetchLeaderboard(); 
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatUser = (email) => {
    if (!email) return "Guest";
    if (email === 'Guest (You)') return email;
    return email.split('@')[0];
  };

  const isInitialCell = (row, col) => initialPuzzle[row][col] !== 0;

  const handleCellClick = (row, col) => {
    if (!isInitialCell(row, col) && !gameWon) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberClick = (num) => {
    if (selectedCell && !gameWon) {
      const { row, col } = selectedCell;
      const newPuzzle = [...puzzle.map(r => [...r])];
      newPuzzle[row][col] = num;
      setPuzzle(newPuzzle);

      const newStatus = [...cellStatus.map(r => [...r])];
      newStatus[row][col] = null;
      setCellStatus(newStatus);
    }
  };

  const clearSelectedCell = () => {
    if (selectedCell && !gameWon) {
      const { row, col } = selectedCell;
      const newPuzzle = [...puzzle.map(r => [...r])];
      newPuzzle[row][col] = 0;
      setPuzzle(newPuzzle);

      const newStatus = [...cellStatus.map(r => [...r])];
      newStatus[row][col] = null;
      setCellStatus(newStatus);
    }
  };

  const saveScoreToFirebase = async () => {
    if (!user) return; 

    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        await updateDoc(userRef, { scores: arrayUnion(timer) });
      } else {
        await setDoc(userRef, { email: user.email, scores: [timer] });
      }

      await addDoc(collection(db, "leaderboard"), {
        email: user.email,
        time: timer,
        date: serverTimestamp()
      });
      
      fetchLeaderboard(); 
    } catch (error) {
      console.error("Error saving score: ", error);
    }
  };

  const validatePuzzle = async () => {
    const newStatus = [...cellStatus.map(r => [...r])];
    let isComplete = true;
    let hasErrors = false;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!isInitialCell(r, c)) {
          const value = puzzle[r][c];
          const correctValue = solvedPuzzle[r][c];

          if (value !== 0) {
            if (value === correctValue) {
              newStatus[r][c] = 'correct';
            } else {
              newStatus[r][c] = 'error';
              hasErrors = true;
            }
          } else {
            newStatus[r][c] = null;
            isComplete = false;
          }
        }
      }
    }
    setCellStatus(newStatus);

    if (isComplete && !hasErrors) {
      setGameWon(true);
      setIsActive(false);
      
      if (user) {
        await saveScoreToFirebase();
        const msg = `You solved it in ${formatTime(timer)}!`;
        Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Victory! 🏆", msg);
      } else {
        const guestEntry = { email: 'Guest (You)', time: timer };
        setLeaderboard(prev => [...prev, guestEntry].sort((a,b) => a.time - b.time).slice(0, 10));

        const msg = `You solved it in ${formatTime(timer)}!`;
        Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Victory! 🏆", msg);
      }
    }
  };

  const getHint = () => {
    if (gameWon) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          const newPuzzle = [...puzzle.map(r => [...r])];
          newPuzzle[row][col] = solvedPuzzle[row][col];
          setPuzzle(newPuzzle);
          setTimer(t => t + 10);
          
          const newStatus = [...cellStatus.map(r => [...r])];
          newStatus[row][col] = 'correct';
          setCellStatus(newStatus);
          return;
        }
      }
    }
  };

  const handleSignUpToSave = () => {
    navigation.navigate('SignUp', { score: timer });
  };

  // ✅ FIXED: Navigation Logic
  const handleExit = () => {
    // We use replace because MenuScreen replaced itself with SudokuGame.
    // 'replace' brings us back to Menu cleanly without stacking history.
    navigation.replace('Menu');
  };

  if (loading) {
    return (
      <View style={SudokuStyles.scrollContainer}>
        <ActivityIndicator size="large" color="#2a9d8f" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={SudokuStyles.scrollContainer}>
      <View style={SudokuStyles.mainLayout}>
        
        {/* GAME SECTION */}
        <View style={SudokuStyles.container}>
          <View style={SudokuStyles.headerContainer}>
            {/* ✅ FIXED: Uses handleExit function */}
            <TouchableOpacity onPress={handleExit} style={SudokuStyles.backButton}>
              <Text style={SudokuStyles.backButtonText}>Exit</Text>
            </TouchableOpacity>
            <Text style={SudokuStyles.timerText}>{formatTime(timer)}</Text>
          </View>

          <Text style={SudokuStyles.title}>Sudoku</Text>
          {!user && <Text style={SudokuStyles.guestText}>Playing as Guest</Text>}

          <View style={SudokuStyles.gameContainer}>
            <View style={SudokuStyles.grid}>
              {puzzle.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                  const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                  const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;
                  const isInitial = isInitialCell(rowIndex, colIndex);

                  let statusStyle = null;
                  if (!isInitial) {
                    if (cellStatus[rowIndex][colIndex] === 'correct') statusStyle = SudokuStyles.correctCell;
                    if (cellStatus[rowIndex][colIndex] === 'error') statusStyle = SudokuStyles.errorCell;
                  }

                  return (
                    <TouchableOpacity
                      key={`${rowIndex}-${colIndex}`}
                      style={[
                        SudokuStyles.cell,
                        isRightBorder && SudokuStyles.cellRightBorder,
                        isBottomBorder && SudokuStyles.cellBottomBorder,
                        isInitial ? SudokuStyles.initialCell : SudokuStyles.editableCell,
                        statusStyle, 
                        isSelected && SudokuStyles.selectedCell 
                      ]}
                      onPress={() => handleCellClick(rowIndex, colIndex)}
                      disabled={isInitial}
                    >
                      <Text style={[
                        SudokuStyles.cellText,
                        isInitial && SudokuStyles.initialText,
                        (!isInitial && cellStatus[rowIndex][colIndex] === 'error') && SudokuStyles.errorText
                      ]}>
                        {cell !== 0 ? cell : ''}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              )}
            </View>

            {/* CONTROLS */}
            <View style={SudokuStyles.controls}>
              {!gameWon ? (
                <>
                  <View style={SudokuStyles.numpad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <TouchableOpacity 
                        key={num} 
                        style={SudokuStyles.numButton} 
                        onPress={() => handleNumberClick(num)}
                      >
                        <Text style={SudokuStyles.numButtonText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={[SudokuStyles.numButton, SudokuStyles.clearButton]} onPress={clearSelectedCell}>
                      <Text style={SudokuStyles.numButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={SudokuStyles.actionButtons}>
                    <TouchableOpacity onPress={getHint} style={SudokuStyles.actionBtn}>
                      <Text style={SudokuStyles.actionBtnText}>Hint (+10s)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => validatePuzzle()} style={[SudokuStyles.actionBtn, SudokuStyles.checkBtn]}>
                      <Text style={SudokuStyles.actionBtnText}>Check</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={SudokuStyles.victoryContainer}>
                  <Text style={SudokuStyles.victoryText}>Puzzle Solved!</Text>
                  
                  {!user && (
                    <TouchableOpacity onPress={handleSignUpToSave} style={[SudokuStyles.playAgainBtn, { backgroundColor: '#e9c46a', marginBottom: 10 }]}>
                      <Text style={[SudokuStyles.playAgainText, { color: '#264653' }]}>Sign Up to Save Score 💾</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity onPress={startNewGame} style={SudokuStyles.playAgainBtn}>
                    <Text style={SudokuStyles.playAgainText}>Play Again 🔄</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* LEADERBOARD SECTION */}
        <View style={SudokuStyles.leaderboardPanel}>
          <Text style={SudokuStyles.leaderboardTitle}>🏆 Top 10 Times</Text>
          {leaderboard.length === 0 ? (
            <Text style={SudokuStyles.noScores}>Loading scores...</Text>
          ) : (
            leaderboard.map((item, index) => (
              <View key={index} style={[
                SudokuStyles.leaderboardRow, 
                item.email === 'Guest (You)' && { backgroundColor: '#fff3cd' } 
              ]}>
                <Text style={SudokuStyles.rankText}>#{index + 1}</Text>
                <View style={{flex:1, paddingHorizontal: 10}}>
                  <Text style={[
                    SudokuStyles.leaderboardUser,
                    item.email === 'Guest (You)' && { fontWeight: 'bold', color: '#e76f51' }
                  ]} numberOfLines={1}>
                    {formatUser(item.email)}
                  </Text>
                </View>
                <Text style={SudokuStyles.leaderboardTime}>{formatTime(item.time)}</Text>
              </View>
            ))
          )}
          {!user && !gameWon && (
            <Text style={SudokuStyles.guestHint}>Log in (or win) to see your name here!</Text>
          )}
        </View>

      </View>
    </ScrollView>
  );
}