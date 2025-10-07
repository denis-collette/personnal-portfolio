import React, { useEffect, useState, useRef } from "react";
import { fetchEvents } from "./mockApi";
import turtleImage from '/src/projects/didlycthulhudoo/assets/turtle.png';
import helloAudio from '/src/projects/didlycthulhudoo/assets/hello.mp3';

export default function Home({ onEventClick }) {
  const [eventsList, setEventsList] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(helloAudio.src);
    }
    fetchEvents().then((data) => { setEventsList(data); });
  }, []);

  const handleEventClick = (e, eventId) => {
    e.preventDefault();
    onEventClick(eventId);
  };

  const playHello = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  if (eventsList === null) {
    return <p>Loading events...</p>;
  }

  return (
    <div className="container">
      <div className="Intro">
        <h2>What do you want to Cthulhudoo?</h2>
        <img src={turtleImage.src} alt="Mine turtle" onClick={playHello} className="Turtle" title="Click me!" />
        <p>The most merciful thing in the world, I think, is the inability of the human mind to correlate all its contents. We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far.</p>
      </div>

      <div className="DisplayEvents">
        <h2>All Events</h2>
        <ul className="EventsList">
          {eventsList.map((event) => (
            <div className="event" key={event.id}>
              <li>
                <a href="#" onClick={(e) => handleEventClick(e, event.id)}>
                  {event.title}
                </a>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}