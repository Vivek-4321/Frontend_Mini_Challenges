import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaRegCircle } from 'react-icons/fa';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const boardRef = useRef(null);
  const lineRef = useRef(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  }, [board]);

  const renderSquare = (i) => (
    <button  className={`square ${winningLine && winningLine.includes(i) ? 'winner' : ''}`}  onClick={() => handleClick(i)}>
      {board[i] === 'X' && <FaTimes className="icon x" />}
      {board[i] === 'O' && <FaRegCircle className="icon o" />}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine(null);
    if (lineRef.current) {
      lineRef.current.style.width = '0';
    }
  };

  useEffect(() => {
    if (winningLine && boardRef.current && lineRef.current) {
      const [start, _, end] = winningLine;
      const startRect = boardRef.current.children[start].getBoundingClientRect();
      const endRect = boardRef.current.children[end].getBoundingClientRect();
      const boardRect = boardRef.current.getBoundingClientRect();

      const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
      );
      const angle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

      lineRef.current.style.width = `${lineLength}px`;
      lineRef.current.style.transform = `rotate(${angle}rad)`;
      lineRef.current.style.top = `${startRect.top - boardRect.top + startRect.height / 2}px`;
      lineRef.current.style.left = `${startRect.left - boardRect.left + startRect.width / 2}px`;
      
      // Trigger reflow
      lineRef.current.offsetHeight;
      
      lineRef.current.style.transition = 'width 0.5s ease-out';
      lineRef.current.style.width = `${lineLength}px`;
    }
  }, [winningLine]);

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="board-container">
        <div className="ttt-board" ref={boardRef}>
          {board.map((_, index) => renderSquare(index))}
        </div>
        <div className="strike-line" ref={lineRef}></div>
      </div>
      <div className="game-info">
        {winner ? (
          <p>Winner: {winner}</p>
        ) : board.every(Boolean) ? (
          <p>It's a draw!</p>
        ) : (
          <p>Next player: {xIsNext ? 'X' : 'O'}</p>
        )}
        <button className="reset_button" onClick={resetGame}>Reset Game</button>
      </div>
      {/* {winner && <div className="confetti-container">{[...Array(50)].map((_, i) => <div key={i} className="confetti" />)}</div>} */}
    </div>
  );
};

export default TicTacToe;