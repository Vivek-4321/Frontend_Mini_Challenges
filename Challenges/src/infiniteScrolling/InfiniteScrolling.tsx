import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import './InfiniteScrolling.css';

interface Pokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

const InfiniteScrolling: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [loading, setLoading] = useState(false);

  const fetchPokemon = useCallback(async () => {
    if (!nextUrl) return;

    setLoading(true);
    try {
      const response = await axios.get(nextUrl);
      const newPokemonData = await Promise.all(
        response.data.results.map(async (result: { url: string }) => {
          const pokemonResponse = await axios.get(result.url);
          return pokemonResponse.data;
        })
      );
      setPokemon((prevPokemon) => [...prevPokemon, ...newPokemonData]);
      setNextUrl(response.data.next);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    }
    setLoading(false);
  }, [nextUrl]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchPokemon();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="InfiniteScrolling">
      {/* <h1>Pokémon Gallery</h1> */}
      <div className="pokemon-grid">
        {pokemon.map((poke) => (
          <div key={poke.id} className="pokemon-card">
            <img 
              src={poke.sprites.other['official-artwork'].front_default} 
              alt={poke.name} 
            />
            <div className="pokemon-info">
              <h2>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h2>
              <p>Types: {poke.types.map(t => t.type.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="loading">
          <FaSpinner className="spinner" />
          <p>Loading more Pokémon...</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrolling;