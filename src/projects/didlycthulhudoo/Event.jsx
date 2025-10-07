import React, { useEffect, useState } from "react";
import { fetchEventById } from "./mockApi";

export default function Event({ eventId }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [availabilities, setAvailabilities] = useState({});

  useEffect(() => {
    fetchEventById(eventId).then((data) => {
      setCurrentEvent(data);
    });
  }, [eventId]);

  const handleAvailabilityChange = (date, isAvailable) => {
    setAvailabilities({ ...availabilities, [date]: isAvailable });
  };
  
  const handleSubmitAttendance = (e) => {
    e.preventDefault();
    if (!attendeeName) { alert("Please enter your name."); return; }

    const availableArray = currentEvent.dates.map(date => !!availabilities[date]);
    const newAttendance = { name: attendeeName, available: availableArray };
    
    const updatedEvent = {
      ...currentEvent,
      attendances: [...currentEvent.attendances, newAttendance]
    };
    
    setCurrentEvent(updatedEvent);
    setAttendeeName('');
    setAvailabilities({});
    alert("Your attendance has been recorded! (This is a demo).");
  };

   const displayDateFormat = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  if (!currentEvent) {
    return <div className="container"><p>Loading event...</p></div>;
  }

  return (
    <div className="container">
      <div className="eventDescription">
        <h2>{currentEvent.title}</h2>
        <p>{currentEvent.description}</p>
        <cite>Created by: {currentEvent.author}</cite>
      </div>

      <div className="inputAttendees">
        <h3>Are you available?</h3>
        <form className="newAttendee" onSubmit={handleSubmitAttendance}>
          <input placeholder="Enter your name" value={attendeeName} onChange={(e) => setAttendeeName(e.target.value)} required />
          <div>
            {currentEvent.dates.map(date => (
              <div key={date}>
                <span>{new Date(date).toLocaleDateString('en-GB')}</span>
                <label><input type="radio" name={date} onChange={() => handleAvailabilityChange(date, true)} required /> Yes</label>
                <label><input type="radio" name={date} onChange={() => handleAvailabilityChange(date, false)} /> No</label>
              </div>
            ))}
          </div>
          <button type="submit">Submit Attendance</button>
        </form>
      </div>

      <br />

      <div className="results">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              {currentEvent.dates?.map((date) => (
                <th key={date}>{displayDateFormat(date)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentEvent.attendances?.map((attendee) => (
              <tr key={attendee.name}>
                <td>{attendee.name}</td>
                {attendee.available.map((isAvailable, index) => (
                  <td key={index}>{isAvailable ? "✅" : "❌"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}