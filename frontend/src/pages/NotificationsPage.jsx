import React, { useEffect, useState } from 'react';
import { notificationsAPI } from '../services/api';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.getAll()
      .then(res => setNotifications(res.data.notifications))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600" size={28} /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-teal-800">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllRead} className="text-sm text-teal-600 hover:underline flex items-center gap-1">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-body">No notifications yet.</p>
          <p className="text-gray-400 text-sm font-body mt-1">Save schemes to get deadline alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n._id} className={`card flex gap-3 ${!n.isRead ? 'border-teal-200 bg-teal-50' : ''}`}>
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.isRead ? 'bg-teal-500' : 'bg-gray-200'}`} />
              <div>
                <p className="font-display font-semibold text-sm text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 font-body mt-0.5">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
