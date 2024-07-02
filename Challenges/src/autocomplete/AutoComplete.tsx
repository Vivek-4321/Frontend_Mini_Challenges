import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';

const AutocompleteComponent = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteText, setAutocompleteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const [allPokemon, setAllPokemon] = useState([]);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        setAllPokemon(data.results.map(pokemon => pokemon.name));
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    };
    fetchAllPokemon();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce((query) => {
      if (query.length > 1) {
        setIsLoading(true);
        const filteredPokemon = allPokemon.filter(name => 
          name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filteredPokemon);
        if (filteredPokemon.length > 0) {
          setAutocompleteText(filteredPokemon[0]);
        } else {
          setAutocompleteText('');
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setAutocompleteText('');
      }
    }, 300),
    [allPokemon]
  );

  useEffect(() => {
    fetchSuggestions(input);
  }, [input, fetchSuggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && autocompleteText) {
      e.preventDefault();
      setInput(autocompleteText);
      setAutocompleteText('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    setAutocompleteText('');
    inputRef.current.focus();
  };

  return (
    <div className="autocomplete-container">
      <div className="autocomplete-wrapper">
        <div className="input-wrapper">
          <FaSearch className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search Pokémon..."
            className="autocomplete-input"
          />
          {autocompleteText && input && autocompleteText.startsWith(input.toLowerCase()) && (
            <div className="autocomplete-text">
              {input}
              <span className="grey-text">{autocompleteText.slice(input.length)}</span>
            </div>
          )}
        </div>
        {showSuggestions && (input.length > 1) && (
          <div className="suggestions-list">
            {isLoading ? (
              <div className="suggestion-item loading">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))
            ) : (
              <div className="suggestion-item no-results">No Pokémon found</div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .autocomplete-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-light);
          height: 90vh;
          width: 100%;
          background-color: var(--color-primary);
        }

        .autocomplete-wrapper {
          width: 300px;
          border: 3px solid var(--color-dark);
          border-radius: 1rem;
          overflow: hidden;
          background: var(--color-primary);
box-shadow:  10px 10px 20px #080808,
             -10px -10px 20px #141614
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          color: var(--color-light);
          opacity: 0.7;
          z-index: 2;
        }

        .autocomplete-input {
          width: 100%;
          padding: 15px 15px 15px 40px;
          font-size: 16px;
          background-color: transparent;
          color: var(--color-light);
          border: none;
          outline: none;
          position: relative;
          z-index: 1;
        }

        .autocomplete-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .autocomplete-text {
          position: absolute;
          left: 40px;
          top: 15px;
          font-size: 16px;
          color: var(--color-light);
          pointer-events: none;
          text-transform: lowercase;
        }

        .grey-text {
          color: rgba(255, 255, 255, 0.5);
        }

        .suggestions-list {
          background-color: var(--color-primary);
          border-top: 1px solid var(--color-dark);
          max-height: 200px;
          overflow-y: auto;
        }

        .suggestion-item {
          padding: 10px 15px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          text-transform: capitalize;
        }

        .suggestion-item:hover {
          background-color: var(--color-dark);
        }

        .suggestion-item.loading,
        .suggestion-item.no-results {
          font-style: italic;
          opacity: 0.7;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .suggestions-list {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AutocompleteComponent;