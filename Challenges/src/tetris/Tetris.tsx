import React, { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import './Tetris.css';

// Define types
type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type CellType = TetrominoType | null;
type GridType = CellType[][];

// Define tetromino shapes
const TETROMINOES: { [key in TetrominoType]: number[][] } = {
  'I': [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  'O': [[1, 1], [1, 1]],
  'T': [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  'S': [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  'Z': [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  'J': [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  'L': [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
};

const COLORS: { [key in TetrominoType]: string } = {
  'I': '#00f0f0',
  'O': '#f0f000',
  'T': '#a000f0',
  'S': '#00f000',
  'Z': '#f00000',
  'J': '#0000f0',
  'L': '#f0a000'
};

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<GridType>(createEmptyGrid());
  const [currentTetromino, setCurrentTetromino] = useState<TetrominoType>(getRandomTetromino());
  const [nextTetromino, setNextTetromino] = useState<TetrominoType>(getRandomTetromino());
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, Math.floor(GRID_WIDTH / 2) - 2]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  function createEmptyGrid(): GridType {
    return Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null));
  }

  function getRandomTetromino(): TetrominoType {
    const tetrominoes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  }

  const moveDown = useCallback(() => {
    const [row, col] = currentPosition;
    if (canMoveTo(row + 1, col, TETROMINOES[currentTetromino])) {
      setCurrentPosition([row + 1, col]);
    } else {
      placeTetromino();
      clearLines();
      setCurrentTetromino(nextTetromino);
      setNextTetromino(getRandomTetromino());
      const newPosition: [number, number] = [0, Math.floor(GRID_WIDTH / 2) - 2];
      setCurrentPosition(newPosition);
      if (!canMoveTo(newPosition[0], newPosition[1], TETROMINOES[nextTetromino])) {
        setGameOver(true);
      }
    }
  }, [currentPosition, currentTetromino, nextTetromino]);

  function canMoveTo(newRow: number, newCol: number, tetromino: number[][]): boolean {
    for (let row = 0; row < tetromino.length; row++) {
      for (let col = 0; col < tetromino[row].length; col++) {
        if (tetromino[row][col]) {
          const gridRow = newRow + row;
          const gridCol = newCol + col;
          if (
            gridRow >= GRID_HEIGHT ||
            gridCol < 0 ||
            gridCol >= GRID_WIDTH ||
            (gridRow >= 0 && grid[gridRow][gridCol] !== null)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function placeTetromino() {
    const [row, col] = currentPosition;
    const tetromino = TETROMINOES[currentTetromino];
    const newGrid = [...grid];
    for (let i = 0; i < tetromino.length; i++) {
      for (let j = 0; j < tetromino[i].length; j++) {
        if (tetromino[i][j]) {
          const gridRow = row + i;
          if (gridRow >= 0) {
            newGrid[gridRow][col + j] = currentTetromino;
          }
        }
      }
    }
    setGrid(newGrid);
  }

  function clearLines() {
    const newGrid = grid.filter((row) => row.some((cell) => cell === null));
    const clearedLines = GRID_HEIGHT - newGrid.length;
    const newScore = score + clearedLines * 100;
    setScore(newScore);
    while (newGrid.length < GRID_HEIGHT) {
      newGrid.unshift(Array(GRID_WIDTH).fill(null));
    }
    setGrid(newGrid);
  }

  function rotate() {
    const tetromino = TETROMINOES[currentTetromino];
    const rotated = tetromino[0].map((_, index) =>
      tetromino.map((row) => row[index]).reverse()
    );
    if (canMoveTo(currentPosition[0], currentPosition[1], rotated)) {
      setCurrentTetromino(prevTetromino => {
        const newTetromino = [...TETROMINOES[prevTetromino]];
        for (let i = 0; i < newTetromino.length; i++) {
          for (let j = 0; j < newTetromino[i].length; j++) {
            newTetromino[i][j] = rotated[i][j];
          }
        }
        TETROMINOES[prevTetromino] = newTetromino;
        return prevTetromino;
      });
    }
  }

  function moveLeft() {
    const [row, col] = currentPosition;
    if (canMoveTo(row, col - 1, TETROMINOES[currentTetromino])) {
      setCurrentPosition([row, col - 1]);
    }
  }

  function moveRight() {
    const [row, col] = currentPosition;
    if (canMoveTo(row, col + 1, TETROMINOES[currentTetromino])) {
      setCurrentPosition([row, col + 1]);
    }
  }

  function restartGame() {
    setGrid(createEmptyGrid());
    setCurrentTetromino(getRandomTetromino());
    setNextTetromino(getRandomTetromino());
    setCurrentPosition([0, Math.floor(GRID_WIDTH / 2) - 2]);
    setScore(0);
    setGameOver(false);
  }

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(moveDown, 1000);
      return () => clearInterval(intervalId);
    }
  }, [moveDown, gameOver]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameOver) {
        switch (event.key) {
          case 'ArrowLeft':
            moveLeft();
            break;
          case 'ArrowRight':
            moveRight();
            break;
          case 'ArrowDown':
            moveDown();
            break;
          case 'ArrowUp':
            rotate();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveDown, gameOver]);

  return (
    <div className="tetris-container">
      <h1 className="tetris-title">Tetris</h1>
      <div className="tetris-game">
        <div className="tetris-grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="tetris-row">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`tetris-cell ${cell ? 'filled' : ''}`}
                  style={{ backgroundColor: cell ? COLORS[cell] : undefined }}
                />
              ))}
            </div>
          ))}
          {!gameOver && (
            <div
              className="current-tetromino"
              style={{
                top: `${currentPosition[0] * 30}px`,
                left: `${currentPosition[1] * 30}px`,
              }}
            >
              {TETROMINOES[currentTetromino].map((row, rowIndex) => (
                <div key={rowIndex} className="tetromino-row">
                  {row.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`tetromino-cell ${cell ? 'filled' : ''}`}
                      style={{ backgroundColor: cell ? COLORS[currentTetromino] : undefined }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over">Game Over</div>
              <button className="restart-button" onClick={restartGame}>
                <FiRefreshCw /> Restart
              </button>
            </div>
          )}
        </div>
        <div className="tetris-info">
          <div className="score">Score: {score}</div>
          <div className="next-tetromino">
            <h3>Next:</h3>
            <div className="next-tetromino-grid">
              {TETROMINOES[nextTetromino].map((row, rowIndex) => (
                <div key={rowIndex} className="tetromino-row">
                  {row.map((cell, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`tetromino-cell ${cell ? 'filled' : ''}`}
                      style={{ backgroundColor: cell ? COLORS[nextTetromino] : undefined }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tetris;