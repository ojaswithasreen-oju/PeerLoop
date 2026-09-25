import React from 'react';
import { Bell, Zap, Calendar, MessageSquare } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const notifications = [
    {
      id: 'notif-1',
      type: 'session',
      icon: Calendar,
      iconColor: 'text-[#3F6B5B]',
      title: 'Session Reminder: Python Doubt Session with Rahul',
      time: 'In 30 minutes (6:30 PM)',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'match',
      icon: Zap,
      iconColor: 'text-[#3F6B5B]',
      title: 'Peer Match: Priya requested help in UI/UX Design tokens',
      time: '12 minutes ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'community',
      icon: MessageSquare,
      iconColor: 'text-[#387B62]',
      title: 'Rahul commented on your achievement: "Great work with nested loops!"',
      time: '2 hours ago',
      read: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Recent updates on your peer sessions, doubt requests, and campus activity.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl bg-white border transition-all flex items-start gap-3.5 shadow-xs ${
                notif.read ? 'border-[#E5EAE7]' : 'border-[#DCE9E2] bg-[#F0F4F1]/30'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#F7F8F5] border border-[#E5EAE7] flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${notif.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold text-[#1F2933]">
                  {notif.title}
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5 font-mono">{notif.time}</p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#3F6B5B] shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
