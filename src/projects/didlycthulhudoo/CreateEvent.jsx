import React, { useState } from "react";

export default function CreateEvent({ onHomeClick }) {
  const [dates, setDates] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  const addDate = () => {
    if (currentDate && !dates.includes(currentDate)) {
      setDates([...dates, currentDate].sort());
      setCurrentDate('');
    }
  };

  const deleteDate = (dateToDelete) => {
    setDates(dates.filter(date => date !== dateToDelete));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    alert(`Event "${payload.name}" created!\nAuthor: ${payload.author}\nDates: ${dates.join(', ')}\n\n(This is a demo - data is not saved).`);
    onHomeClick();
  };

  return (
    <div className="container">
      <h2>Create a New Event</h2>
      <form className="FormNewEvent" onSubmit={handleSubmit}>
        <label>Event Name:</label><br />
        <input type="text" name="name" placeholder="Your Event Name" required /><br />
        
        <label>Event Description:</label><br />
        <input type="text" name="description" placeholder="Describe your gathering" required /><br />

        <label>Your Name:</label><br />
        <input type="text" name="author" placeholder="Who is hosting?" required /><br />
        
        <div>
          <label>Propose Dates:</label><br />
          <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
          <button type="button" onClick={addDate}>Add Date</button>
        </div>

        <div>
          {dates.map(date => (
            <div key={date}>
              <span>{date}</span>
              <button type="button" onClick={() => deleteDate(date)}>Delete</button>
            </div>
          ))}
        </div>
        <br />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}