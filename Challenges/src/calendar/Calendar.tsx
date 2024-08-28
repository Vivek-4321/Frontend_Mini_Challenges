import React, { useState, useEffect } from "react";
import "./Calendar.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import { BsCalendarX } from "react-icons/bs";

interface Event {
  id: number;
  date: Date;
  title: string;
  description: string;
  time: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showYearInput, setShowYearInput] = useState(false);
  const [yearInput, setYearInput] = useState(
    currentDate.getFullYear().toString()
  );

  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    date: new Date(),
    title: "",
    description: "",
    time: "",
  });

  useEffect(() => {
    if (selectedDate) {
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setMinutes(
        adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
      );
      setNewEvent((prev) => ({ ...prev, date: adjustedDate }));
    }
  }, [selectedDate]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayEvents = events.filter(
        (event) => event.date.toDateString() === date.toDateString()
      );

      days.push(
        <div
          key={day}
          className={`calendar-day ${
            selectedDate?.toDateString() === date.toDateString()
              ? "selected"
              : ""
          } ${isToday(date) ? "today" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <span>{day}</span>
          {dayEvents.length > 0 && <div className="event-dot"></div>}
          {isToday(date) && <div className="today-dot"></div>}
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleYearClick = () => {
    setShowYearInput(true);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearInput(e.target.value);
  };

  const handleYearSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const year = parseInt(yearInput, 10);
    if (!isNaN(year) && year >= 1 && year <= 9999) {
      setCurrentDate(new Date(year, currentDate.getMonth(), 1));
      setShowYearInput(false);
    } else {
      setYearInput(currentDate.getFullYear().toString());
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? { ...newEvent, id: event.id } : event
        )
      );
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }
    setShowEventForm(false);
    setEditingEvent(null);
    setNewEvent({ date: new Date(), title: "", description: "", time: "" });
  };

  const handleEventDelete = () => {
    if (editingEvent) {
      setEvents(events.filter((event) => event.id !== editingEvent.id));
      setShowEventForm(false);
      setEditingEvent(null);
    }
  };

  const renderSidebarEvents = () => {
    const monthEvents = events.filter(
      (event) =>
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );

    if (monthEvents.length === 0) {
      return (
        <div className="no-events">
          <BsCalendarX size={48} />
          <p>No events this month</p>
        </div>
      );
    }

    return (
      <div className="sidebar-container">
        <h3>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}{" "}
          Events
        </h3>
        {monthEvents
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((event) => (
            <div
              key={event.id}
              className={`sidebar-event ${
                selectedDate?.toDateString() === event.date.toDateString()
                  ? "highlighted"
                  : ""
              }`}
              onClick={() => {
                setEditingEvent(event);
                setShowEventForm(true);
              }}
            >
              <h3>{event.title}</h3>
              <p>
                {event.date.toDateString()} - {event.time}
              </p>
              <p>{event.description}</p>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <div className="calendar-main">
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>
              <FaChevronLeft />
            </button>
            {showYearInput ? (
              <form onSubmit={handleYearSubmit}>
                <input
                  type="number"
                  className="year-input"
                  value={yearInput}
                  onChange={handleYearChange}
                  onBlur={() => setShowYearInput(false)}
                  autoFocus
                />
              </form>
            ) : (
              <h2 onClick={handleYearClick}>
                <FaCalendarAlt />{" "}
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            )}
            <button onClick={handleNextMonth}>
              <FaChevronRight />
            </button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-day-header">Su</div>
            <div className="calendar-day-header">Mo</div>
            <div className="calendar-day-header">Tu</div>
            <div className="calendar-day-header">We</div>
            <div className="calendar-day-header">Th</div>
            <div className="calendar-day-header">Fr</div>
            <div className="calendar-day-header">Sa</div>
            {renderCalendar()}
          </div>
          <button
            className="add-event-button"
            onClick={() => setShowEventForm(true)}
          >
            <FaPlus /> Add Event
          </button>
        </div>
        <div className="calendar-sidebar">{renderSidebarEvents()}</div>
        <div className={`event-form-overlay ${showEventForm ? "active" : ""}`}>
          <form onSubmit={handleEventSubmit} className="event-form">
            <h3>{editingEvent ? "Edit Event" : "Add Event"}</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Event Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            ></textarea>
            <input
              type="date"
              value={newEvent.date.toISOString().split("T")[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                newDate.setMinutes(
                  newDate.getMinutes() - newDate.getTimezoneOffset()
                );
                setNewEvent({ ...newEvent, date: newDate });
              }}
              required
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent({ ...newEvent, time: e.target.value })
              }
              required
            />
            <button type="submit">
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
            {editingEvent && (
              <button type="button" onClick={handleEventDelete}>
                Delete Event
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowEventForm(false);
                setEditingEvent(null);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
