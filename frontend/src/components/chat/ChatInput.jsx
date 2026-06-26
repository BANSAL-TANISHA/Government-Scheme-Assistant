import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Trash2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import useSpeech from '../../hooks/useSpeech';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  "I'm a student from Rajasthan",
  "I'm a farmer with 3 acres",
  "I'm a woman entrepreneur",
  "Schemes for widows",
];

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage, clearChat, isTyping } = useChat();
  const textareaRef = useRef(null);
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeech();

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    await sendMessage(text);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Called automatically when voice recognition ends (user stopped speaking)
  const handleVoiceAutoEnd = (finalText) => {
    if (finalText) {
      setInput(finalText);
      resetTranscript();
      toast.success('Voice captured! Press Enter to send.', { icon: '✅', duration: 2000 });
    }
  };

  const handleVoice = () => {
    if (isListening) {
      // Manual stop — capture whatever was transcribed
      stopListening();
      if (transcript) {
        setInput(transcript);
        resetTranscript();
      }
    } else {
      setInput('');
      resetTranscript();
      // Pass handleVoiceAutoEnd so text is auto-filled when user stops speaking
      startListening('hi-IN', handleVoiceAutoEnd);
      toast('Listening… Speak in Hindi or English', { icon: '🎙️', duration: 2500 });
    }
  };

  // While listening, show live transcript in input box
  const displayValue = isListening ? (transcript || input) : input;

  return (
    <div className="border-t border-cream-200 px-4 py-3 bg-cream-50">
      {/* Quick prompts */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => setInput(p)}
            className="text-xs px-2.5 py-1 bg-white border border-teal-200 text-teal-700 rounded-full hover:bg-teal-50 transition-colors font-body">
            {p}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question in Hindi or English... (e.g., मैं राजस्थान से हूँ, कोई योजना बताएं?)"
          rows={1}
          className="flex-1 input-field resize-none text-sm min-h-[42px] max-h-28"
          style={{ height: 'auto' }}
          onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px'; }}
        />
        <button onClick={handleVoice}
          className={`p-2.5 rounded-lg border transition-colors ${isListening ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' : 'bg-white border-cream-200 text-teal-600 hover:bg-teal-50'}`}
          title={isListening ? 'Stop listening' : 'Speak your question'}>
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button onClick={handleSend} disabled={!input.trim() || isTyping}
          className="p-2.5 rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <Send size={18} />
        </button>
        <button onClick={clearChat} title="Clear chat"
          className="p-2.5 rounded-lg border border-cream-200 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:border-red-200 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
