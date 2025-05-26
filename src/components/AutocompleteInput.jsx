import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "./contexts";

const AutocompleteInput = ({ suggestions, value, onChange, placeholder, inputClass }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const containerRef = useRef(null);
  const suggestionRefs = useRef([]);

  const handleInputChange = (e) => {
    const inputVal = e.target.value;
    onChange(e);
    if (inputVal.length > 0) {
      const filtered = suggestions.filter(sugg =>
        sugg.toLowerCase().includes(inputVal.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (sugg) => {
    onChange({ target: { value: sugg } });
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
        e.preventDefault();
        handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      }
    }
  };

  // Défilement automatique de l'élément actif dans le popup
  useEffect(() => {
    if (
      activeSuggestionIndex >= 0 &&
      suggestionRefs.current[activeSuggestionIndex]
    ) {
      suggestionRefs.current[activeSuggestionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeSuggestionIndex]);

  // Fermer le popup de suggestions si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fermer le popup dès que le focus se déplace sur un autre champ
  useEffect(() => {
    const handleFocusIn = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);


  const { theme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-600";

  return (
    <div className={`relative ${bgColor}`} ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClass}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className={`scrollbar-custom absolute top-full left-0 right-0 z-50 ${bgColor} border border-gray-300 max-h-40 overflow-y-auto`}>
          {filteredSuggestions.map((sugg, index) => (
            <li
              key={index}
              ref={el => suggestionRefs.current[index] = el}
              onClick={() => handleSuggestionClick(sugg)}
              className={`p-2 cursor-pointer ${index === activeSuggestionIndex ? "bg-blue-100 text-gray-600" : "hover:bg-gray-200 hover:text-gray-600"
                }`}
            >
              {sugg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
