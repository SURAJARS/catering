import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { eventsAPI, panchangamAPI } from '../api';
import { PANCHANGAM_COLORS } from '../config';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarView.css';

/**
 * Calendar View Component
 * Visual calendar with event booking and panchangam highlighting
 */
const CalendarView = ({ events, onSelectDate, selectedDate }) => {
  const [panchangamData, setPanchangamData] = useState({});
  const [loading, setLoading] = useState(false);

  // Get panchangam for current month
  useEffect(() => {
    const fetchPanchangamForMonth = async () => {
      try {
        setLoading(true);
        const startDate = new Date(selectedDate);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const response = await panchangamAPI.getRange(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );

        console.log('Panchangam API Response:', response.data.data);

        const data = {};
        response.data.data.forEach((p) => {
          const dateKey = new Date(p.date).toISOString().split('T')[0];
          data[dateKey] = p;
        });

        console.log('Panchangam Data Stored:', data);
        setPanchangamData(data);
      } catch (error) {
        console.error('Failed to fetch panchangam:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchangamForMonth();
  }, [selectedDate]);

  const getPanchangamColor = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const p = panchangamData[dateKey];

    if (!p) {
      return PANCHANGAM_COLORS.DEFAULT;
    }

    if (p.isMarriageDay && p.isAuspiciousDay) {
      return PANCHANGAM_COLORS.AUSPICIOUS;
    }

    if (p.rahukalam || p.yamagandam) {
      return PANCHANGAM_COLORS.INAUSPICIOUS;
    }

    return PANCHANGAM_COLORS.NEUTRAL;
  };

  const getEventsForDate = (date) => {
    return events.filter((e) => {
      const eDate = new Date(e.eventDate);
      return eDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateEvents = getEventsForDate(date);
      if (dateEvents.length > 0) {
        return (
          <div className="calendar-tile-content">
            <span className="event-count">{dateEvents.length}</span>
          </div>
        );
      }
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const color = getPanchangamColor(date);
      const classes = ['calendar-tile'];
      
      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (color === PANCHANGAM_COLORS.AUSPICIOUS) classes.push('auspicious');
      // Only apply inauspicious if it's NOT a weekend
      else if (color === PANCHANGAM_COLORS.INAUSPICIOUS && !isWeekend) classes.push('inauspicious');
      else if (color === PANCHANGAM_COLORS.NEUTRAL) classes.push('neutral');

      return classes.join(' ');
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <Calendar
          value={selectedDate}
          onChange={onSelectDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          prev2Label={null}
          next2Label={null}
        />
      </div>

      <div className="calendar-legend">
        <h4>📅 Legend</h4>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: PANCHANGAM_COLORS.AUSPICIOUS }} />
          <span>Auspicious Marriage Day</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: PANCHANGAM_COLORS.INAUSPICIOUS }} />
          <span>Inauspicious</span>
        </div>
      </div>

      {loading && <p className="loading-text">Loading panchangam data...</p>}
    </div>
  );
};

export default CalendarView;
