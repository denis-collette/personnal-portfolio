import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaRedo, FaUndo, FaMusic } from 'react-icons/fa';

export default function AudioPlayerBar({ audioEl, activeSong, onNext, onPrev, onSeek, onSkip, onSongClick }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioEl;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => { if (onNext) onNext(); };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleTimeUpdate);

    handleTimeUpdate();
    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleTimeUpdate);
    };
  }, [audioEl, onNext]);

  const handlePlayPause = () => {
    if (isPlaying) audioEl.pause();
    else audioEl.play();
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleProgressBarClick = (e) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const newProgress = clickPosition / rect.width;
      if (onSeek) onSeek(newProgress);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioEl) audioEl.volume = newVolume;
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioEl) audioEl.volume = newMuted ? 0 : volume;
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between p-3 bg-neutral-900 text-white gap-4">
      <div onClick={onSongClick} className="flex items-center gap-4 w-full sm:w-1/4 cursor-pointer">
        {activeSong.imgUrl ? (
          <img src={activeSong.imgUrl} alt={activeSong.title} className="w-16 h-16 rounded bg-neutral-800" />
        ) : (
          <div className="w-16 h-16 rounded bg-neutral-800 flex items-center justify-center">
            <FaMusic className="text-gray-500 text-2xl" />
          </div>
        )}
        <div>
          <p className="font-bold truncate text-sm">{activeSong.title}</p>
          <p className="text-xs text-gray-400 truncate">{activeSong.author}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-full sm:flex-grow">
        <div className="flex items-center gap-6 text-xl">
          <button onClick={() => onSkip(-10)} title="Skip back 10s" className="cursor-pointer hover:text-gray-400">
            <FaUndo onClick={() => onSkip(-10)} className="cursor-pointer hover:text-gray-400" title="Skip back 10s" />
          </button>
          <FaStepBackward onClick={onPrev} className="cursor-pointer hover:text-gray-400" title="Previous Chapter" />
          <button onClick={handlePlayPause} className="text-3xl" title="Play/Pause">{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <FaStepForward onClick={onNext} className="cursor-pointer hover:text-gray-400" title="Next Chapter" />
          <button onClick={() => onSkip(10)} title="Skip forward 10s" className="cursor-pointer hover:text-gray-400">
            <FaRedo onClick={() => onSkip(10)} className="cursor-pointer hover:text-gray-400" title="Skip forward 10s" />
          </button>
        </div>
        <div className="w-full flex items-center gap-2 text-xs">
          <span>{formatTime(currentTime)}</span>
          <div ref={progressBarRef} onClick={handleProgressBarClick} className="w-full bg-gray-600 rounded-full h-1 cursor-pointer">
            <div className="bg-white h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-full sm:w-1/4 flex items-center justify-center sm:justify-end gap-2">
        <button onClick={toggleMute} title="Mute/Unmute">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-24 accent-white" />
      </div>
    </div>
  );
}