// Generate a unique session ID.
// Stored ONLY in memory (not localStorage/sessionStorage).
// This means every page refresh = brand new session = clean profile slate.
// Within the same page visit, the ID stays stable (held in React useRef).

let _currentSessionId = null;

export const getSessionId = () => {
  if (!_currentSessionId) {
    _currentSessionId = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  return _currentSessionId;
};

// Call this when user clicks "Clear Chat" — generates a new in-memory ID
export const newSessionId = () => {
  _currentSessionId = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  return _currentSessionId;
};
