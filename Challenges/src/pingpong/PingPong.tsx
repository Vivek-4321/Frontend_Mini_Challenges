// import React, { useState, useEffect, useCallback } from 'react';
// import { FaPlay, FaPause } from 'react-icons/fa';
// import './PingPong.css';

// const PADDLE_HEIGHT = 100;
// const PADDLE_WIDTH = 10;
// const BALL_SIZE = 15;
// const GAME_WIDTH = 800;
// const GAME_HEIGHT = 400;

// interface GameState {
//   ballX: number;
//   ballY: number;
//   ballSpeedX: number;
//   ballSpeedY: number;
//   paddle1Y: number;
//   paddle2Y: number;
//   score1: number;
//   score2: number;
//   isPlaying: boolean;
//   lastScoreTime: number;
// }

// const PingPongGame: React.FC = () => {
//   const [gameState, setGameState] = useState<GameState>({
//     ballX: GAME_WIDTH / 2,
//     ballY: GAME_HEIGHT / 2,
//     ballSpeedX: 5,
//     ballSpeedY: 5,
//     paddle1Y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
//     paddle2Y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
//     score1: 0,
//     score2: 0,
//     isPlaying: false,
//     lastScoreTime: 0,
//   });

//   const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

//   const handleKeyDown = useCallback((e: KeyboardEvent) => {
//     setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
//   }, []);

//   const handleKeyUp = useCallback((e: KeyboardEvent) => {
//     setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
//   }, []);

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [handleKeyDown, handleKeyUp]);

//   useEffect(() => {
//     if (!gameState.isPlaying) return;

//     const gameLoop = setInterval(() => {
//       setGameState((prevState) => {
//         const currentTime = Date.now();
//         if (currentTime - prevState.lastScoreTime < 1000) {
//           return prevState; // Don't update if we're in the 1-second delay after scoring
//         }

//         let newBallX = prevState.ballX + prevState.ballSpeedX;
//         let newBallY = prevState.ballY + prevState.ballSpeedY;
//         let newBallSpeedX = prevState.ballSpeedX;
//         let newBallSpeedY = prevState.ballSpeedY;
//         let newScore1 = prevState.score1;
//         let newScore2 = prevState.score2;
//         let newLastScoreTime = prevState.lastScoreTime;

//         // Paddle movement
//         const paddleSpeed = 5;
//         let newPaddle1Y = prevState.paddle1Y;
//         let newPaddle2Y = prevState.paddle2Y;

//         if (keys['w']) newPaddle1Y = Math.max(0, newPaddle1Y - paddleSpeed);
//         if (keys['s']) newPaddle1Y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPaddle1Y + paddleSpeed);
//         if (keys['ArrowUp']) newPaddle2Y = Math.max(0, newPaddle2Y - paddleSpeed);
//         if (keys['ArrowDown']) newPaddle2Y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPaddle2Y + paddleSpeed);

//         // Ball collision with top and bottom walls
//         if (newBallY <= 0 || newBallY >= GAME_HEIGHT - BALL_SIZE) {
//           newBallSpeedY = -newBallSpeedY;
//         }

//         // Ball collision with paddles
//         if (
//           (newBallX <= PADDLE_WIDTH && newBallY + BALL_SIZE >= newPaddle1Y && newBallY <= newPaddle1Y + PADDLE_HEIGHT) ||
//           (newBallX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && newBallY + BALL_SIZE >= newPaddle2Y && newBallY <= newPaddle2Y + PADDLE_HEIGHT)
//         ) {
//           newBallSpeedX = -newBallSpeedX;
//         }

//         // Score points
//         if (newBallX <= 0) {
//           newScore2++;
//           newBallX = GAME_WIDTH / 2;
//           newBallY = GAME_HEIGHT / 2;
//           newLastScoreTime = currentTime;
//         } else if (newBallX >= GAME_WIDTH - BALL_SIZE) {
//           newScore1++;
//           newBallX = GAME_WIDTH / 2;
//           newBallY = GAME_HEIGHT / 2;
//           newLastScoreTime = currentTime;
//         }

//         return {
//           ...prevState,
//           ballX: newBallX,
//           ballY: newBallY,
//           ballSpeedX: newBallSpeedX,
//           ballSpeedY: newBallSpeedY,
//           paddle1Y: newPaddle1Y,
//           paddle2Y: newPaddle2Y,
//           score1: newScore1,
//           score2: newScore2,
//           lastScoreTime: newLastScoreTime,
//         };
//       });
//     }, 1000 / 60); // 60 FPS

//     return () => clearInterval(gameLoop);
//   }, [gameState.isPlaying, keys]);

//   const togglePlay = () => {
//     setGameState((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
//   };

//   return (
//     <div className="game_container">
//       <div className="game_board">
//         <div className="paddle left-paddle" style={{ top: gameState.paddle1Y }}></div>
//         <div className="paddle right-paddle" style={{ top: gameState.paddle2Y }}></div>
//         <div className="ball" style={{ left: gameState.ballX, top: gameState.ballY }}></div>
//         <div className="Score left-score">{gameState.score1}</div>
//         <div className="Score right-score">{gameState.score2}</div>
//       </div>
//       <button className="play-pause-button" onClick={togglePlay}>
//         {gameState.isPlaying ? <FaPause /> : <FaPlay />}
//       </button>
//       <style jsx>{`
        
//         .game_board {
//           width: ${GAME_WIDTH}px;
//           height: ${GAME_HEIGHT}px;
//           position: relative;
//           overflow: hidden;

//         }
//         .paddle {
//           width: ${PADDLE_WIDTH}px;
//           height: ${PADDLE_HEIGHT}px;
//           background-color: white;
//           position: absolute;
//           transition: top 0.05s linear;
//         }
        
//         .ball {
//           width: ${BALL_SIZE}px;
//           height: ${BALL_SIZE}px;
//           background-color: white;
//           border-radius: 50%;
//           position: absolute;
//           transition: all 0.05s linear;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PingPongGame;

import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './PingPong.css';

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 15;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const MATCH_DURATION = 60; // Match duration in seconds

interface GameState {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1Y: number;
  paddle2Y: number;
  score1: number;
  score2: number;
  isPlaying: boolean;
  lastScoreTime: number;
  timeRemaining: number;
  winner: string | null;
}

const PingPongGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT / 2,
    ballSpeedX: 5,
    ballSpeedY: 5,
    paddle1Y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    paddle2Y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    score1: 0,
    score2: 0,
    isPlaying: false,
    lastScoreTime: 0,
    timeRemaining: MATCH_DURATION,
    winner: null,
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!gameState.isPlaying) return;

    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        if (prevState.timeRemaining <= 0) {
          clearInterval(gameLoop);
          return {
            ...prevState,
            isPlaying: false,
            winner: prevState.score1 > prevState.score2 ? 'Player 1' : prevState.score2 > prevState.score1 ? 'Player 2' : 'Tie',
          };
        }

        const currentTime = Date.now();
        if (currentTime - prevState.lastScoreTime < 1000) {
          return { ...prevState, timeRemaining: prevState.timeRemaining - 1/60 };
        }

        let newBallX = prevState.ballX + prevState.ballSpeedX;
        let newBallY = prevState.ballY + prevState.ballSpeedY;
        let newBallSpeedX = prevState.ballSpeedX;
        let newBallSpeedY = prevState.ballSpeedY;
        let newScore1 = prevState.score1;
        let newScore2 = prevState.score2;
        let newLastScoreTime = prevState.lastScoreTime;

        // Paddle movement
        const paddleSpeed = 5;
        let newPaddle1Y = prevState.paddle1Y;
        let newPaddle2Y = prevState.paddle2Y;

        if (keys['w']) newPaddle1Y = Math.max(0, newPaddle1Y - paddleSpeed);
        if (keys['s']) newPaddle1Y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPaddle1Y + paddleSpeed);
        if (keys['ArrowUp']) newPaddle2Y = Math.max(0, newPaddle2Y - paddleSpeed);
        if (keys['ArrowDown']) newPaddle2Y = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPaddle2Y + paddleSpeed);

        // Ball collision with top and bottom walls
        if (newBallY <= 0 || newBallY >= GAME_HEIGHT - BALL_SIZE) {
          newBallSpeedY = -newBallSpeedY;
        }

        // Ball collision with paddles
        if (
          (newBallX <= PADDLE_WIDTH && newBallY + BALL_SIZE >= newPaddle1Y && newBallY <= newPaddle1Y + PADDLE_HEIGHT) ||
          (newBallX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && newBallY + BALL_SIZE >= newPaddle2Y && newBallY <= newPaddle2Y + PADDLE_HEIGHT)
        ) {
          newBallSpeedX = -newBallSpeedX;
        }

        // Score points
        if (newBallX <= 0) {
          newScore2++;
          newBallX = GAME_WIDTH / 2;
          newBallY = GAME_HEIGHT / 2;
          newLastScoreTime = currentTime;
        } else if (newBallX >= GAME_WIDTH - BALL_SIZE) {
          newScore1++;
          newBallX = GAME_WIDTH / 2;
          newBallY = GAME_HEIGHT / 2;
          newLastScoreTime = currentTime;
        }

        return {
          ...prevState,
          ballX: newBallX,
          ballY: newBallY,
          ballSpeedX: newBallSpeedX,
          ballSpeedY: newBallSpeedY,
          paddle1Y: newPaddle1Y,
          paddle2Y: newPaddle2Y,
          score1: newScore1,
          score2: newScore2,
          lastScoreTime: newLastScoreTime,
          timeRemaining: prevState.timeRemaining - 1/60,
        };
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying, keys]);

  const togglePlay = () => {
    if (gameState.winner) {
      // Reset the game
      setGameState({
        ...gameState,
        ballX: GAME_WIDTH / 2,
        ballY: GAME_HEIGHT / 2,
        ballSpeedX: 5,
        ballSpeedY: 5,
        paddle1Y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        paddle2Y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        score1: 0,
        score2: 0,
        isPlaying: true,
        lastScoreTime: 0,
        timeRemaining: MATCH_DURATION,
        winner: null,
      });
    } else {
      setGameState((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
    }
  };

  return (
    <div className="game_container">
      <div className="game_board">
        <div className="paddle left-paddle" style={{ top: gameState.paddle1Y }}></div>
        <div className="paddle right-paddle" style={{ top: gameState.paddle2Y }}></div>
        <div className="ball" style={{ left: gameState.ballX, top: gameState.ballY }}></div>
        <div className="Score left-score">{gameState.score1}</div>
        <div className="Score right-score">{gameState.score2}</div>
        <div className="timer">{Math.ceil(gameState.timeRemaining)}</div>
        {gameState.winner && (
          <div className="Winner-overlay">
            <h2>{gameState.winner === 'Tie' ? "It's a Tie!" : `${gameState.winner} Wins!`}</h2>
          </div>
        )}
      </div>
      <button className="play-pause-button" onClick={togglePlay}>
        {gameState.winner ? 'New Game' : gameState.isPlaying ? <FaPause /> : <FaPlay />}
      </button>
      <style jsx>{`
        .game_board {
          width: ${GAME_WIDTH}px;
          height: ${GAME_HEIGHT}px;
          position: relative;
          overflow: hidden;
        }
        .paddle {
          width: ${PADDLE_WIDTH}px;
          height: ${PADDLE_HEIGHT}px;
          background-color: white;
          position: absolute;
          transition: top 0.05s linear;
        }
        .ball {
          width: ${BALL_SIZE}px;
          height: ${BALL_SIZE}px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          transition: all 0.05s linear;
        }
        .timer {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          color: white;
        }
        .Winner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 32px;
        }
      `}</style>
    </div>
  );
};

export default PingPongGame;