import React from 'react';
import { ExternalLink } from 'lucide-react';
import { categoryColors, getCategoryLabel } from '../../utils/helpers';

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';

  // Format content: **bold** and newlines
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j}>{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-2 items-start chat-bubble ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${isUser ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700'}`}>
        {isUser ? 'You' : 'AI'}
      </div>

      <div className={`max-w-[80%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed font-body ${isUser ? 'bg-teal-700 text-white rounded-tr-sm' : 'bg-cream-100 text-gray-800 rounded-tl-sm'} ${message.isError ? 'bg-red-50 text-red-700 border border-red-200' : ''}`}>
          {formatText(message.content)}
        </div>

        {/* Schemes shown inline */}
        {message.schemes && message.schemes.length > 0 && (
          <div className="space-y-1.5 w-full">
            {message.schemes.map(scheme => (
              <div key={scheme._id} className="bg-white border border-teal-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className={`badge text-[10px] mb-1 ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>{getCategoryLabel(scheme.category)}</span>
                    <p className="font-display font-semibold text-teal-800 text-xs">{scheme.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{scheme.benefits}</p>
                  </div>
                  {scheme.portalLink && (
                    <a href={scheme.portalLink} target="_blank" rel="noreferrer" className="shrink-0 p-1 text-teal-600 hover:text-teal-800">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <span className="text-[10px] text-gray-400">{new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
