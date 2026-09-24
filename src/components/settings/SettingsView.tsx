import React, { useState } from 'react';
import { Settings, Shield, Bell, Moon, Laptop, User, Volume2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifyOnMatches, setNotifyOnMatches] = useState(true);
  const [audioPings, setAudioPings] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Manage your account preferences, notifications, and AI session assistant configurations.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#151E33] border border-[#1E2A47] space-y-5 shadow-lg">
        <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#8B5CF6]" />
          <span>Session Alerts</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#F8FAFC]">Instant Peer Match Alerts</p>
              <p className="text-[11px] text-[#94A3B8]">
                Notify when students request help in your teaching skills (Python, UI/UX).
              </p>
            </div>
            <button
              onClick={() => setNotifyOnMatches(!notifyOnMatches)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyOnMatches ? 'bg-[#8B5CF6]' : 'bg-[#11182B]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  notifyOnMatches ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[#1E2A47] pt-4">
            <div>
              <p className="text-xs font-semibold text-[#F8FAFC]">Audio Alerts for Doubts</p>
              <p className="text-[11px] text-[#94A3B8]">
                Play subtle chime when a 5-minute quick doubt arrives while online.
              </p>
            </div>
            <button
              onClick={() => setAudioPings(!audioPings)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                audioPings ? 'bg-[#22D3EE]' : 'bg-[#11182B]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  audioPings ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
