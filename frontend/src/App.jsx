import React, { useState, useEffect } from 'react';
import { FiPlus, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import CalendarView from './components/CalendarView';
import TamilCalendarView from './components/TamilCalendarView';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import SearchBar from './components/SearchBar';
import LoginModal from './components/LoginModal';
import { useAuth } from './hooks/useAuth';
import { eventsAPI } from './api';
import './styles/App.css';

/**
 * Main App Component
 * Routes between different sections and manages global state
 */
function App() {
  const { isAuthenticated, userEmail, loading, login, logout, allowedEmail } = useAuth();
  const [currentView, setCurrentView] = useState('events'); // events, calendar, tamil-calendar, dashboard, settings
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch events on component mount and when view changes
  useEffect(() => {
    if (currentView === 'events' || currentView === 'calendar' || currentView === 'tamil-calendar') {
      fetchEvents();
    } else if (currentView === 'dashboard') {
      fetchDashboardStats();
    }
  }, [currentView]);

  // Refresh events automatically every 30 seconds
  useEffect(() => {
    if (currentView === 'events' || currentView === 'calendar' || currentView === 'tamil-calendar') {
      const interval = setInterval(() => {
        fetchEvents();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentView]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      // Filter out cancelled events
      const activeEvents = response.data.data.filter((e) => !e.isCancelled);
      setEvents(activeEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleSearchSelect = (event) => {
    setCurrentView('events'); // Switch to events view
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      setLoading(true);
      if (selectedEvent) {
        await eventsAPI.update(selectedEvent._id, eventData);
      } else {
        await eventsAPI.create(eventData);
      }
      setShowForm(false);
      setSelectedEvent(null);
      await fetchEvents();
      if (currentView === 'dashboard') {
        await fetchDashboardStats();
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      alert(error.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        setLoading(true);
        await eventsAPI.delete(eventId);
        await fetchEvents();
        if (currentView === 'dashboard') {
          await fetchDashboardStats();
        }
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to cancel event');
      } finally {
        setLoading(false);
      }
    }
  };

  const getFilteredEventsForDate = () => {
    return events.filter((e) => {
      const eDate = new Date(e.eventDate);
      return eDate.toDateString() === selectedDate.toDateString();
    });
  };

  return (
    <>
      {!isAuthenticated ? (
        <LoginModal onLogin={login} allowedEmail={allowedEmail} />
      ) : (
        <div className="app">
        <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/assets/logo.png" alt="Amman Catering" className="app-logo" />
            <h1>Amman Catering</h1>
          </div>

          <SearchBar onSelectEvent={handleSearchSelect} />
          
          <nav className="header-nav">
            <button
              className={`nav-btn ${currentView === 'events' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('events');
                setMenuOpen(false);
              }}
            >
              📋 Events
            </button>
            <button
              className={`nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('calendar');
                setMenuOpen(false);
              }}
            >
              📅 Calendar
            </button>
            <button
              className={`nav-btn ${currentView === 'tamil-calendar' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('tamil-calendar');
                setMenuOpen(false);
              }}
            >
              🇮🇳 Tamil
            </button>
            <button
              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('dashboard');
                setMenuOpen(false);
              }}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setCurrentView('settings');
                setMenuOpen(false);
              }}
            >
              ⚙️ Settings
            </button>
          </nav>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {userEmail && (
            <div className="user-menu">
              <span className="user-email">{userEmail}</span>
              <button className="btn-logout" title="Logout" onClick={logout}>
                <FiLogOut size={20} />
              </button>
            </div>
          )}
        </div>

        <nav className={`app-nav ${menuOpen ? 'open' : ''}`}>
          <button
            className={`nav-btn ${currentView === 'events' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('events');
              setMenuOpen(false);
            }}
          >
            📋 Events
          </button>
          <button
            className={`nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('calendar');
              setMenuOpen(false);
            }}
          >
            📅 Calendar
          </button>
          <button
            className={`nav-btn ${currentView === 'tamil-calendar' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('tamil-calendar');
              setMenuOpen(false);
            }}
          >
            🇮🇳 Tamil
          </button>
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('dashboard');
              setMenuOpen(false);
            }}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('settings');
              setMenuOpen(false);
            }}
          >
            ⚙️ Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'events' && (
          <>
            <button className="btn-primary" onClick={handleCreateEvent}>
              <FiPlus /> New Event
            </button>
            <EventList
              events={events}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              loading={loading}
            />
          </>
        )}

        {currentView === 'calendar' && (
          <div className="calendar-section">
            <CalendarView events={events} onSelectDate={setSelectedDate} selectedDate={selectedDate} />
            <div className="calendar-details">
              <h3>
                {selectedDate.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <button className="btn-primary small" onClick={handleCreateEvent}>
                <FiPlus /> New Event
              </button>
              <EventList
                events={getFilteredEventsForDate()}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                loading={loading}
              />
            </div>
          </div>
        )}

        {currentView === 'tamil-calendar' && (
          <div className="tamil-calendar-section">
            <button className="btn-primary" onClick={handleCreateEvent}>
              <FiPlus /> New Event
            </button>
            <TamilCalendarView events={events} />
          </div>
        )}

        {currentView === 'dashboard' && <Dashboard stats={stats} />}

        {currentView === 'settings' && <Settings />}
      </main>

      {showForm && (
        <EventForm
          event={selectedEvent}
          onClose={() => {
            setShowForm(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
          loading={loading}
        />
      )}

      {loading && currentView !== 'events' && currentView !== 'calendar' && (
        <div className="loading-overlay">Loading...</div>
      )}
    </div>
      )}
    </>
  );
}

export default App;
