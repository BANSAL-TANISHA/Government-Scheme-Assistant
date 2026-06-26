import { useState, useCallback, useRef } from 'react';

const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  // Callback to call when speech auto-ends (silence detected)
  const onAutoEndRef = useRef(null);

  const startListening = useCallback((lang = 'hi-IN', onAutoEnd = null) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    // Keep listening continuously so user doesn't have to tap every sentence
    recognition.continuous = false;

    // Store the latest final transcript in a ref so onend can access it
    let latestTranscript = '';

    recognition.onstart = () => { setIsListening(true); setError(null); };

    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      latestTranscript = t;
    };

    recognition.onerror = (e) => {
      setError(e.error);
      setIsListening(false);
    };

    // KEY FIX: When speech stops automatically (silence), put text into input box
    recognition.onend = () => {
      setIsListening(false);
      if (latestTranscript && onAutoEndRef.current) {
        onAutoEndRef.current(latestTranscript);
        setTranscript('');
        latestTranscript = '';
      }
    };

    onAutoEndRef.current = onAutoEnd;
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = () => setTranscript('');

  return { isListening, transcript, error, startListening, stopListening, resetTranscript };
};

export default useSpeech;
