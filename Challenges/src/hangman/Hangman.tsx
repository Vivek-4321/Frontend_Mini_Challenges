import React, { useState, useEffect } from 'react';
import { FaPlay, FaRedo, FaCheck, FaTimes } from 'react-icons/fa';
import HangmanFigure from './HangmanFigure';
import './Hangman.css';

const words = ['react', 'typescript', 'javascript', 'programming', 'developer'];

const HangmanGame: React.FC = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameStatus('playing');
  };

  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing') return;

    if (!guessedLetters.includes(letter)) {
      const newGuessedLetters = [...guessedLetters, letter];
      setGuessedLetters(newGuessedLetters);

      if (!word.includes(letter)) {
        const newIncorrectGuesses = incorrectGuesses + 1;
        setIncorrectGuesses(newIncorrectGuesses);
        if (newIncorrectGuesses >= 6) {
          setGameStatus('lost');
        }
      }

      if (word.split('').every(char => newGuessedLetters.includes(char))) {
        setGameStatus('won');
      }
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <span key={index} className="letter">
        {guessedLetters.includes(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderKeyboard = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return alphabet.map(letter => (
      <button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
        className={`keyboard-button ${guessedLetters.includes(letter) ? 'guessed' : ''}`}
      >
        {letter}
      </button>
    ));
  };

  return (
    <div className="hangman-container">
      <div className="game-info">
        <HangmanFigure incorrectGuesses={incorrectGuesses} />
        <div className="word">{renderWord()}</div>
      </div>
      <div className="keyboard">{renderKeyboard()}</div>
      {gameStatus !== 'playing' && <div className="overlay"></div>}
      {gameStatus === 'won' && (
        <div className="game-result won">
          <FaCheck />
          <p>Congratulations! You won!</p>
          <button onClick={startNewGame} className="new-game-button">
            <FaPlay /> Play Again
          </button>
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="game-result lost">
          <FaTimes />
          <p>Game Over! The word was: {word}</p>
          <button onClick={startNewGame} className="new-game-button">
            <FaRedo /> Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default HangmanGame;