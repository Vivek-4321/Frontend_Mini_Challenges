import React, { useState, useEffect, useRef } from 'react';
import { FaCircle } from 'react-icons/fa';
import './ConnectFour.css';

const ROWS = 6;
const COLS = 7;

type Player = 'red' | 'yellow' | null;

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<Player[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [dropAnimation, setDropAnimation] = useState<{ col: number, row: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dropAnimation) {
      const timer = setTimeout(() => {
        setDropAnimation(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dropAnimation]);

  useEffect(() => {
    if (winningCells.length === 4 && boardRef.current && lineRef.current) {
      const [start, end] = [winningCells[0], winningCells[3]];
      const startCell = boardRef.current.children[start[0] * COLS + start[1]] as HTMLElement;
      const endCell = boardRef.current.children[end[0] * COLS + end[1]] as HTMLElement;
      const boardRect = boardRef.current.getBoundingClientRect();

      const startRect = startCell.getBoundingClientRect();
      const endRect = endCell.getBoundingClientRect();

      const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
      );
      const angle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

      lineRef.current.style.width = '0';
      lineRef.current.style.transform = `rotate(${angle}rad)`;
      lineRef.current.style.top = `${startRect.top - boardRect.top + startRect.height / 2}px`;
      lineRef.current.style.left = `${startRect.left - boardRect.left + startRect.width / 2}px`;
      
      // Trigger reflow
      lineRef.current.offsetHeight;
      
      lineRef.current.style.transition = 'width 0.5s ease-out';
      lineRef.current.style.width = `${lineLength}px`;
    }
  }, [winningCells]);

  const checkWinner = (row: number, col: number, player: Player) => {
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal top-left to bottom-right
      [1, -1], // diagonal top-right to bottom-left
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      const winningCells: [number, number][] = [[row, col]];

      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++;
          winningCells.push([newRow, newCol]);
        } else {
          break;
        }
      }

      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++;
          winningCells.unshift([newRow, newCol]);
        } else {
          break;
        }
      }

      if (count >= 4) {
        setWinningCells(winningCells);
        return true;
      }
    }

    return false;
  };

  const handleClick = (col: number) => {
    if (winner || board[0][col]) return;

    const newBoard = board.map(row => [...row]);
    let row = ROWS - 1;

    while (row >= 0 && newBoard[row][col]) {
      row--;
    }

    if (row >= 0) {
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setDropAnimation({ col, row });

      if (checkWinner(row, col, currentPlayer)) {
        setWinner(currentPlayer);
      } else if (newBoard.every(row => row.every(cell => cell !== null))) {
        setWinner('draw');
      } else {
        setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells([]);
    setDropAnimation(null);
    if (lineRef.current) {
      lineRef.current.style.width = '0';
    }
  };

  const renderCell = (cell: Player, row: number, col: number) => {
    const isWinningCell = winningCells.some(([r, c]) => r === row && c === col);
    const isAnimating = dropAnimation?.col === col && dropAnimation?.row === row;

    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${cell || ''} ${isWinningCell ? 'winning' : ''} ${isAnimating ? 'dropping' : ''}`}
        style={{ '--drop-distance': `${row * 100}%` } as React.CSSProperties}
        onClick={() => handleClick(col)}
      >
        {cell && <FaCircle className={`piece ${cell}`} />}
      </div>
    );
  };

  return (
    <div className="connect-four">
      <h1>Connect Four</h1>
      <div className="board-container">
        <div className="board" ref={boardRef}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
        </div>
        <div className="strike-line" ref={lineRef}></div>
      </div>
      {winner && (
        <div className="winner-message">
          {winner === 'draw' ? "It's a draw!" : `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`}
        </div>
      )}
      {!winner && (
        <div className="current-player">
          <p>Current player: </p> <FaCircle className={`piece ${currentPlayer}`} />
        </div>
      )}
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default ConnectFour;