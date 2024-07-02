import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

interface Character {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  gender: string;
  image: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

const CharacterCard: React.FC<{ character: Character }> = ({ character }) => (
  <div className="character-card">
    <img src={character.image} alt={character.name} className="character-image" />
    <h2>{character.name}</h2>
    <p>Height: {character.height}cm</p>
    <p>Mass: {character.mass}kg</p>
    <p>Birth Year: {character.birth_year}</p>
    <p>Gender: {character.gender}</p>
  </div>
);

const StarWarsPagination: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, [currentPage]);

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://swapi.dev/api/people/?page=${currentPage}`);
      const data: ApiResponse = await response.json();
      
      const charactersWithImages = await Promise.all(
        data.results.map(async (character) => {
          const imageResponse = await fetch(`https://starwars-visualguide.com/assets/img/characters/${getCharacterId(character)}.jpg`);
          const image = imageResponse.ok ? imageResponse.url : 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
          return { ...character, image };
        })
      );

      setCharacters(charactersWithImages);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error('Error fetching Star Wars characters:', error);
    }
    setIsLoading(false);
  };

  const getCharacterId = (character: Character) => {
    const url = character.url || '';
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : '1';
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="star-wars-app">
      <h1>Star Wars Characters</h1>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <div className="character-grid">
          {characters.map((character) => (
            <CharacterCard key={character.name} character={character} />
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <FaChevronLeft /> Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default StarWarsPagination;