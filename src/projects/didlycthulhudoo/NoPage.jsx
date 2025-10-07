import React, { useEffect, useRef } from "react";
import errorImage from '/src/projects/didlycthulhudoo/assets/404.png';
import errorAudio from '/src/projects/didlycthulhudoo/assets/404.mp3';

export default function NoPage() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(errorAudio.src);
    }
  }, []);

  const play404 = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  return (
    <div className="container">
      <div className="error404">
        <img src={errorImage.src} alt="Cthulhu has eaten this page" style={{ height: '250px', cursor: 'pointer' }} onClick={play404} />
        <h1>Cthulhu ate this page... Run!</h1>
      </div>
    </div>
  );
};