import React, { createContext, useContext, useState, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { getSessionId } from '../utils/session';

const ChatContext = createContext(null);
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'नमस्ते! 🙏 I am Yojana Sahayak, your AI assistant for government schemes.\n\nTell me about yourself — your age, state, occupation, or any specific need — and I will find the right government schemes for you.\n\nYou can type in Hindi or English!',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [partialSchemes, setPartialSchemes] = useState([]);
  const [extractedProfile, setExtractedProfile] = useState({});
  const [sessionId] = useState(getSessionId());

  const sendMessage = useCallback(async (text) => {
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await chatAPI.sendMessage({ message: text, sessionId });
      const { response, eligibleSchemes: es, partialSchemes: ps, extractedProfile: ep } = res.data;

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        schemes: es,
      }]);
      if (es) setEligibleSchemes(es);
      if (ps) setPartialSchemes(ps);
      if (ep) setExtractedProfile(ep);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [sessionId]);

  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: 'Chat cleared. How can I help you find government schemes today?',
      timestamp: new Date(),
    }]);
    setEligibleSchemes([]);
    setPartialSchemes([]);
    setExtractedProfile({});
  };

  return (
    <ChatContext.Provider value={{ messages, isTyping, eligibleSchemes, partialSchemes, extractedProfile, sessionId, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};
