import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { eventsAPI } from '../api';
import '../styles/SearchBar.css';

/**
 * SearchBar Component
 * Global search for events by name, phone, nickname, type, etc.
 */

const SearchBar = ({ onSelectEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef(null);

  // Handle search when user types
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setError('');

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await eventsAPI.searchEvents(query);
      setSearchResults(response.data.data || []);
      setIsOpen(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search events');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format event for display
  const formatEventDisplay = (event) => {
    const dateStr = new Date(event.eventDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return `${event.clientName} (${event.phoneNumber}) - ${event.eventType} on ${dateStr}`;
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search events... (name, phone, nickname, type)"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setIsOpen(true)}
        />
        {searchQuery && (
          <button
            className="clear-btn"
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown">
          {loading && <div className="search-status">Searching...</div>}

          {error && <div className="search-error">{error}</div>}

          {!loading && searchResults.length === 0 && searchQuery && (
            <div className="search-status">No events found</div>
          )}

          {!loading && searchResults.length > 0 && (
            <>
              <div className="search-results">
                {searchResults.map((event) => (
                  <button
                    key={event._id}
                    className="search-result-item"
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="result-name">{event.clientName}</div>
                    <div className="result-details">
                      {event.phoneNumber} • {event.eventType}
                      {event.clientNickname && ` • "${event.clientNickname}"`}
                    </div>
                    <div className="result-date">
                      {new Date(event.eventDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </button>
                ))}
              </div>
              <div className="search-footer">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
