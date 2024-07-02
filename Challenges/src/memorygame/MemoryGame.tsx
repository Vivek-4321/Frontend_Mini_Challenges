import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

interface Card extends Pokemon {
  flipped: boolean;
  matched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].id === cards[second].id) {
        setCards(prevCards =>
          prevCards.map((card, index) =>
            index === first || index === second ? { ...card, matched: true } : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === first || index === second ? { ...card, flipped: false } : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs === 8 && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedPairs, cards]);

  const fetchPokemon = async () => {
    const pokemonIds = generateRandomPokemonIds(8);
    const pokemonPromises = pokemonIds.map(id =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => ({
          id: data.id,
          name: data.name,
          image: data.sprites.front_default
        }))
    );

    const pokemonList = await Promise.all(pokemonPromises);
    const duplicatedPokemon = [...pokemonList, ...pokemonList];
    const shuffledCards = shuffleArray(duplicatedPokemon).map(pokemon => ({
      ...pokemon,
      flipped: false,
      matched: false
    }));

    setCards(shuffledCards);
  };

  const generateRandomPokemonIds = (count: number): number[] => {
    const ids = new Set<number>();
    while (ids.size < count) {
      ids.add(Math.floor(Math.random() * 898) + 1);
    }
    return Array.from(ids);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length < 2 && !cards[index].flipped && !cards[index].matched) {
      setCards(prevCards =>
        prevCards.map((card, i) =>
          i === index ? { ...card, flipped: true } : card
        )
      );
      setFlippedCards(prev => [...prev, index]);
    }
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameOver(false);
    fetchPokemon();
  };

  return (
    <div className="poke-memory-game">
      <h1 className="poke-memory-title">Pokémon Memory Game</h1>
      <div className="poke-memory-info">
        <p>Moves: {moves}</p>
        <p>Matched Pairs: {matchedPairs}/8</p>
      </div>
      <div className="poke-memory-board">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`poke-memory-card ${card.flipped || card.matched ? 'poke-flipped' : ''} ${card.matched ? 'poke-matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="poke-card-inner">
              <div className="poke-card-front"></div>
              <div className="poke-card-back">
                <img src={card.image} alt={card.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="poke-memory-game-over">
          <h2>Congratulations!</h2>
          <p>You completed the game in {moves} moves.</p>
          <button className="poke-memory-reset-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
      {!gameOver && (
        <button className="poke-memory-reset-button" onClick={resetGame}>
          Reset Game
        </button>
      )}
    </div>
  );
};

export default MemoryGame;