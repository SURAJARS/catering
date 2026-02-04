import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getTamilMonthForDate, getTamilWeekday, TAMIL_WEEKDAYS_SHORT } from '../utils/tamilCalendar';
import '../styles/TamilCalendarView.css';

/**
 * Tamil Calendar View Component
 * Displays Tamil calendar with dates
 */

const TamilCalendarView = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get all days in current month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toDateString();

    return events.filter((e) => new Date(e.eventDate).toDateString() === dateStr);
  };

  const tamilMonth = getTamilMonthForDate(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const calendarDays = [];
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="tamil-calendar-container">
      <div className="calendar-info-banner">
        <p>
          📌 <strong>Tamil Calendar View:</strong> Dates are synchronized with the English calendar. 
          All events shown are the same across both calendar views.
        </p>
      </div>

      <div className="tamil-calendar-header">
        <button className="nav-btn-calendar" onClick={handlePrevMonth}>
          <FiChevronLeft />
        </button>

        <div className="month-display">
          <div className="tamil-month-row">
            <h2>{tamilMonth.tamil}</h2>
            <span className="english-equiv">({tamilMonth.english})</span>
          </div>
          <p className="gregorian-month">
            {currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <p className="calendar-sync-note">Same dates as English calendar</p>
        </div>

        <button className="nav-btn-calendar" onClick={handleNextMonth}>
          <FiChevronRight />
        </button>
      </div>

      <button className="today-btn" onClick={handleToday}>
        Today
      </button>

      <div className="tamil-weekdays">
        {TAMIL_WEEKDAYS_SHORT.map((day, index) => (
          <div key={index} className="tamil-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="tamil-calendar-grid">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day !== null;
          const dateObj = isCurrentMonth
            ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            : null;
          const isToday = isCurrentMonth && dateObj.toDateString() === new Date().toDateString();
          const dayEvents = isCurrentMonth ? getEventsForDate(day) : [];
          const tamilWeekday = isCurrentMonth ? getTamilWeekday(dateObj, true) : '';

          return (
            <div
              key={index}
              className={`tamil-calendar-day ${!isCurrentMonth ? 'empty' : ''} ${
                isToday ? 'today' : ''
              } ${dayEvents.length > 0 ? 'has-events' : ''}`}
            >
              {isCurrentMonth ? (
                <>
                  <div className="day-number">{day}</div>
                  <div className="tamil-day-label">{tamilWeekday}</div>
                  {dayEvents.length > 0 && (
                    <div className="day-event-count">{dayEvents.length} event(s)</div>
                  )}
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div key={idx} className="day-event-preview" title={event.clientName}>
                      {event.clientName.substring(0, 8)}...
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="more-events">+{dayEvents.length - 2}</div>}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="tamil-calendar-legend">
        <div className="legend-item">
          <div className="legend-color today-color"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-color events-color"></div>
          <span>Events scheduled</span>
        </div>
      </div>
    </div>
  );
};

export default TamilCalendarView;
