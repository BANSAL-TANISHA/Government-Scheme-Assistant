export const getSessionId = () => {
  let sid = sessionStorage.getItem('ys_session');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('ys_session', sid);
  }
  return sid;
};
