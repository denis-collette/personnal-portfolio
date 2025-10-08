import { useEffect, useRef } from 'react';

export function useAnalyser(audioEl: HTMLAudioElement | null) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (audioEl) {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }

      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioEl);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      const resumeContext = () => {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
      };
      audioEl.addEventListener('play', resumeContext);
      
      return () => {
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        audioEl.removeEventListener('play', resumeContext);
      };
    }
  }, [audioEl]);

  return analyserRef.current;
}