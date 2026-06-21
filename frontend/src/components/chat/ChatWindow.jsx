import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ProfileSidebar from './ProfileSidebar';

const ChatWindow = () => {
  const { messages, isTyping } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex gap-4 h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-4">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-cream-200 bg-teal-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-saffron-400 flex items-center justify-center font-display font-bold text-teal-800">य</div>
          <div>
            <p className="text-cream-50 font-display font-semibold text-sm">Yojana Sahayak</p>
            <p className="text-teal-300 text-xs">AI Government Scheme Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-teal-300 text-xs">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
          {isTyping && (
            <div className="flex gap-2 items-start chat-bubble">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">AI</div>
              <div className="bg-cream-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                <span className="typing-dot w-2 h-2 bg-teal-600 rounded-full block" />
                <span className="typing-dot w-2 h-2 bg-teal-600 rounded-full block" />
                <span className="typing-dot w-2 h-2 bg-teal-600 rounded-full block" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <ChatInput />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default ChatWindow;
