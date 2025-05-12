import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SudokuStyles from './SudokuGame.styles';
import sudoku from 'sudoku';

const generatePuzzleWithSolution = () => {
  const rawPuzzle = sudoku.makepuzzle(); // returns array of 81 values (nulls and numbers 0–8)
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
  const { puzzle: initial, solution } = generatePuzzleWithSolution();
  const [initialPuzzle, setInitialPuzzle] = useState(initial);
  const [puzzle, setPuzzle] = useState(JSON.parse(JSON.stringify(initial)));
  const [solvedPuzzle, setSolvedPuzzle] = useState(solution);
  const [selectedCell, setSelectedCell] = useState(null);
  const [validationResult, setValidationResult] = useState('');
  const [timer, setTimer] = useState(0);
  const [topTimes, setTopTimes] = useState([]); //toptime
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isInitialCell = (row, col) => initialPuzzle[row][col] !== 0;

  const validatePuzzle = () => {
    const isCorrect = JSON.stringify(puzzle) === JSON.stringify(solvedPuzzle);
    setValidationResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setIsActive(false);
      const newTime = timer;
      setTopTimes(prev => {
        const updated = [...prev, newTime].sort((a, b) => a - b).slice(0, 10);
        return updated;
      });
    }
    
  };

  const solvePuzzle = () => {
    setPuzzle(JSON.parse(JSON.stringify(solvedPuzzle)));
    setIsActive(false);
  };

  const resetPuzzle = () => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzleWithSolution();
    setInitialPuzzle(newPuzzle);
    setPuzzle(JSON.parse(JSON.stringify(newPuzzle)));
    setSolvedPuzzle(newSolution);
    setValidationResult('');
    setTimer(0);
    setIsActive(true);
    setSelectedCell(null);
  };

  const getHint = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          const newPuzzle = [...puzzle.map(r => [...r])];
          newPuzzle[row][col] = solvedPuzzle[row][col];
          setPuzzle(newPuzzle);
          return;
        }
      }
    }
  };

  const handleCellClick = (row, col) => {
    if (!isInitialCell(row, col)) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberClick = (num) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (!isInitialCell(row, col)) {
        const newPuzzle = [...puzzle.map(r => [...r])];
        newPuzzle[row][col] = num;
        setPuzzle(newPuzzle);
      }
    }
  };

  const clearSelectedCell = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (!isInitialCell(row, col)) {
        const newPuzzle = [...puzzle.map(r => [...r])];
        newPuzzle[row][col] = 0;
        setPuzzle(newPuzzle);
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Wrap Sudoku Game + Leaderboard in the same row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        
        {/* Left Side: Sudoku Game */}
        <View style={SudokuStyles.container}>
          <View style={SudokuStyles.gameContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={SudokuStyles.backButton}>
              <Text style={SudokuStyles.buttonText}>Back</Text>
            </TouchableOpacity>
  
            <Text style={SudokuStyles.header}>Sudoku</Text>
  
            <View style={SudokuStyles.statusContainer}>
              <Text style={SudokuStyles.timeText}>Time: {formatTime(timer)}</Text>
              <TouchableOpacity onPress={resetPuzzle} style={SudokuStyles.button}>
                <Text style={SudokuStyles.buttonText}>New Game</Text>
              </TouchableOpacity>
            </View>
  
            {validationResult !== '' && (
              <Text style={validationResult === 'correct' ? SudokuStyles.correctText : SudokuStyles.incorrectText}>
                {validationResult === 'correct' ? 'Puzzle solved correctly! 🎉' : 'Not quite right yet. Keep trying!'}
              </Text>
            )}
  
            <View style={SudokuStyles.grid}>
              {puzzle.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      SudokuStyles.cell,
                      isInitialCell(rowIndex, colIndex) ? SudokuStyles.initialCell : SudokuStyles.editableCell
                    ]}
                    onPress={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell !== 0 && <Text style={SudokuStyles.cellText}>{cell}</Text>}
                    {cell === 0 &&
                      selectedCell &&
                      selectedCell.row === rowIndex &&
                      selectedCell.col === colIndex && (
                        <Text style={SudokuStyles.cursor}>|</Text>
                      )}
                  </TouchableOpacity>
                ))
              )}
            </View>
  
            <View style={SudokuStyles.numberPad}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <TouchableOpacity key={num} style={SudokuStyles.numButton} onPress={() => handleNumberClick(num)}>
                  <Text style={SudokuStyles.buttonText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={SudokuStyles.numButton} onPress={clearSelectedCell}>
                <Text style={SudokuStyles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
  
            <View style={SudokuStyles.controlButtons}>
              <TouchableOpacity onPress={validatePuzzle} style={SudokuStyles.controlButton}>
                <Text style={SudokuStyles.buttonText}>Check</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={getHint} style={SudokuStyles.controlButton}>
                <Text style={SudokuStyles.buttonText}>Hint</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={solvePuzzle} style={SudokuStyles.controlButton}>
                <Text style={SudokuStyles.buttonText}>Solve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
        {/* Right Side: Leaderboard */}
        <View style={[SudokuStyles.leaderboardContainer, { marginLeft: 16 }]}>
          <Text style={SudokuStyles.header}>Top 10 Times</Text>
          {topTimes.length === 0 ? (
            <Text>No records yet.</Text>
          ) : (
            topTimes.map((time, index) => (
              <Text key={index} style={SudokuStyles.timeEntry}>
                #{index + 1}: {formatTime(time)}
              </Text>
            ))
          )}
        </View>
  
      </View>
    </View>
  );
}
