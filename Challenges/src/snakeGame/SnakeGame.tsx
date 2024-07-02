// import React, { useState, useEffect, useCallback } from "react";
// import Snake from "./Snake";
// import Food from "./Food";
// import Controls from "./Controls";
// import "./SnakeGame.css";

// const getRandomCoordinates = () => {
//   let min = 1;
//   let max = 98;
//   let x = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
//   let y = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
//   return [x, y];
// };

// const SnakeGame: React.FC = () => {
//   const [snakeDots, setSnakeDots] = useState([
//     [0, 0],
//     [4, 0],
//   ]);
//   const [food, setFood] = useState(getRandomCoordinates());
//   const [direction, setDirection] = useState("RIGHT");
//   const [speed, setSpeed] = useState(150);
//   const [gameOver, setGameOver] = useState(false);

//   const onKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       switch (e.key) {
//         case "ArrowUp":
//           if (direction !== "DOWN") setDirection("UP");
//           break;
//         case "ArrowDown":
//           if (direction !== "UP") setDirection("DOWN");
//           break;
//         case "ArrowLeft":
//           if (direction !== "RIGHT") setDirection("LEFT");
//           break;
//         case "ArrowRight":
//           if (direction !== "LEFT") setDirection("RIGHT");
//           break;
//       }
//     },
//     [direction]
//   );

//   useEffect(() => {
//     document.addEventListener("keydown", onKeyDown);
//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//     };
//   }, [onKeyDown]);

//   useEffect(() => {
//     const moveSnake = () => {
//       let dots = [...snakeDots];
//       let head = dots[dots.length - 1];

//       switch (direction) {
//         case "RIGHT":
//           head = [head[0] + 4, head[1]];
//           break;
//         case "LEFT":
//           head = [head[0] - 4, head[1]];
//           break;
//         case "DOWN":
//           head = [head[0], head[1] + 4];
//           break;
//         case "UP":
//           head = [head[0], head[1] - 4];
//           break;
//       }
//       dots.push(head);
//       dots.shift();
//       setSnakeDots(dots);
//     };

//     if (!gameOver) {
//       const interval = setInterval(moveSnake, speed);
//       return () => clearInterval(interval);
//     }
//   }, [snakeDots, direction, speed, gameOver]);

//   useEffect(() => {
//     const checkIfOutOfBorders = () => {
//       let head = snakeDots[snakeDots.length - 1];
//       if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
//         onGameOver();
//       }
//     };

//     const checkIfCollapsed = () => {
//       let snake = [...snakeDots];
//       let head = snake[snake.length - 1];
//       snake.pop();
//       snake.forEach((dot) => {
//         if (head[0] === dot[0] && head[1] === dot[1]) {
//           onGameOver();
//         }
//       });
//     };

//     const checkIfEat = () => {
//       let head = snakeDots[snakeDots.length - 1];
//       if (head[0] === food[0] && head[1] === food[1]) {
//         setFood(getRandomCoordinates());
//         enlargeSnake();
//         increaseSpeed();
//       }
//     };

//     checkIfOutOfBorders();
//     checkIfCollapsed();
//     checkIfEat();
//   }, [snakeDots]);

//   const onGameOver = () => {
//     setGameOver(true);
//   };

//   const resetGame = () => {
//     setSnakeDots([
//       [0, 0],
//       [4, 0],
//     ]);
//     setFood(getRandomCoordinates());
//     setDirection("RIGHT");
//     setSpeed(150);
//     setGameOver(false);
//   };

//   const enlargeSnake = () => {
//     let newSnake = [...snakeDots];
//     newSnake.unshift([]);
//     setSnakeDots(newSnake);
//   };

//   const increaseSpeed = () => {
//     if (speed > 50) {
//       // Set a minimum speed limit
//       setSpeed(speed - 10);
//     }
//   };

//   return (
//     <div className="game-container">
//       <div className="game-area">
//         <Snake snakeDots={snakeDots} />
//         <Food dot={food} />
//         {gameOver && <div className="game-over">Game Over</div>}
//         <Controls resetGame={resetGame} />
//       </div>
//     </div>
//   );
// };

// export default SnakeGame;

import React, { useState, useEffect, useCallback } from "react";
import Snake from "./Snake";
import Food from "./Food";
import Controls from "./Controls";
import "./SnakeGame.css";

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 4) * 4;
  return [x, y];
};

const SnakeGame: React.FC = () => {
  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [4, 0],
  ]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(150);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    },
    [direction]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case "RIGHT":
          head = [head[0] + 4, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 4, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 4];
          break;
        case "UP":
          head = [head[0], head[1] - 4];
          break;
      }
      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    };

    if (!gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, direction, speed, gameOver]);

  useEffect(() => {
    const checkIfOutOfBorders = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        onGameOver();
      }
    };

    const checkIfCollapsed = () => {
      let snake = [...snakeDots];
      let head = snake[snake.length - 1];
      snake.pop();
      snake.forEach((dot) => {
        if (head[0] === dot[0] && head[1] === dot[1]) {
          onGameOver();
        }
      });
    };

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
        increaseScore();
      }
    };

    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
  }, [snakeDots]);

  const onGameOver = () => {
    setGameOver(true);
    updateHighestScore();
    resetScore();
  };

  const resetGame = () => {
    setSnakeDots([
      [0, 0],
      [4, 0],
    ]);
    setFood(getRandomCoordinates());
    setDirection("RIGHT");
    setSpeed(150);
    setGameOver(false);
    resetScore();
  };

  const enlargeSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
  };

  const increaseSpeed = () => {
    if (speed > 50) {
      // Set a minimum speed limit
      setSpeed(speed - 10);
    }
  };

  const increaseScore = () => {
    setScore(score + 1);
  };

  const resetScore = () => {
    setScore(0);
  };

  const updateHighestScore = () => {
    if (score > highestScore) {
      setHighestScore(score);
    }
  };

  return (
    <div className="game-container">
      
      <div className="game-area">
      <div className="score-board">
        <div className="score">Score: {score}</div>
        <div className="highest-score">Highest: {highestScore}</div>
      </div>
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
        {gameOver && <div className="game-over-snake">Game Over</div>}
        <Controls resetGame={resetGame} />
      </div>
    </div>
  );
};

export default SnakeGame;
