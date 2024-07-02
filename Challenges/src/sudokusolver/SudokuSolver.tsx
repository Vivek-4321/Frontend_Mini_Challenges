import React, { useState, useEffect } from 'react';
import { FaPlay, FaRedo, FaLightbulb } from 'react-icons/fa';
import './SudokuSolver.css';

const GRID_SIZE = 9;

const generateSudoku = () => {
  // This is a simplified sudoku generator. For a real game, you'd want a more sophisticated algorithm.
  const board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * nums.length);
        board[i][j] = nums[randomIndex];
      }
    }
  }
  return board;
};

const SudokuGame: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newGrid = generateSudoku();
    setGrid(newGrid);
    setInitialGrid(newGrid.map(row => [...row]));
  }, []);

  const handleCellClick = (row: number, col: number) => {
    setSelected([row, col]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selected) return;
    const [row, col] = selected;
    if (initialGrid[row][col] !== 0) return;

    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
      const newGrid = [...grid];
      newGrid[row][col] = num;
      setGrid(newGrid);
      checkGameOver(newGrid);
    }
  };

  const checkGameOver = (currentGrid: number[][]) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) return;
      }
    }
    setGameOver(true);
  };

  const handleNewGame = () => {
    const newGrid = generateSudoku();
    setGrid(newGrid);
    setInitialGrid(newGrid.map(row => [...row]));
    setSelected(null);
    setGameOver(false);
  };

  const handleHint = () => {
    if (!selected) return;
    const [row, col] = selected;
    if (initialGrid[row][col] !== 0) return;

    // In a real game, you'd want to generate a valid hint here
    const hintValue = Math.floor(Math.random() * 9) + 1;
    const newGrid = [...grid];
    newGrid[row][col] = hintValue;
    setGrid(newGrid);
    checkGameOver(newGrid);
  };

  if (grid.length === 0 || initialGrid.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sudoku-game__container">
      <div className="sudoku-game__info">
        <h1>Sudoku Game</h1>
      </div>
      <div className="sudoku-game__grid" onKeyDown={handleKeyPress} tabIndex={0}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-game__row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-game__cell ${selected && selected[0] === rowIndex && selected[1] === colIndex ? 'sudoku-game__cell--selected' : ''} ${initialGrid[rowIndex][colIndex] !== 0 ? 'sudoku-game__cell--initial' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sudoku-game__controls">
        <button onClick={handleNewGame} className="sudoku-game__button">
          <FaPlay /> New Game
        </button>
        <button onClick={handleHint} className="sudoku-game__button" disabled={!selected}>
          <FaLightbulb /> Hint
        </button>
      </div>
      {gameOver && (
        <div className="sudoku-game__overlay">
          <div className="sudoku-game__result">
            <h2>Congratulations!</h2>
            <p>You've completed the Sudoku puzzle!</p>
            <button onClick={handleNewGame} className="sudoku-game__button">
              <FaRedo /> Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuGame;