import React from 'react';
import { Bell, Zap, Calendar, Heart, MessageSquare, CheckCircle2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const notifications = [
    {
      id: 'notif-1',
      type: 'session',
      icon: Calendar,
      iconColor: 'text-[#8B5CF6]',
      title: 'Session Reminder: Python Doubt Session with Rahul',
      time: 'In 30 minutes (6:30 PM)',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'match',
      icon: Zap,
      iconColor: 'text-[#22D3EE]',
      title: 'Peer Match: Priya requested help in UI/UX Design tokens',
      time: '12 minutes ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'community',
      icon: MessageSquare,
      iconColor: 'text-[#34D399]',
      title: 'Rahul commented on your community win: "Great job today Alex!"',
      time: '2 hours ago',
      read: true,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Recent updates on your peer sessions, doubt requests, and campus activity.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl bg-[#151E33] border transition-all flex items-start gap-3.5 ${
                notif.read ? 'border-[#1E2A47]' : 'border-[#8B5CF6]/50 bg-[#151E33]/90'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#11182B] border border-[#1E2A47] flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${notif.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">
                  {notif.title}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-1 font-mono">{notif.time}</p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
