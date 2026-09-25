import React, { useState } from 'react';
import { Bell, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const [notifyOnMatches, setNotifyOnMatches] = useState(true);
  const [audioPings, setAudioPings] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Manage your account preferences, notifications, and AI session assistant configurations.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#1F2933] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#3F6B5B]" />
          <span>Session Alerts</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1F2933]">Instant Peer Match Alerts</p>
              <p className="text-[11px] text-[#6B7280]">
                Notify when students request help in your teaching skills (Python, UI/UX).
              </p>
            </div>
            <button
              onClick={() => setNotifyOnMatches(!notifyOnMatches)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifyOnMatches ? 'bg-[#3F6B5B]' : 'bg-[#E5EAE7]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  notifyOnMatches ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5EAE7] pt-4">
            <div>
              <p className="text-xs font-semibold text-[#1F2933]">Audio Alerts for Doubts</p>
              <p className="text-[11px] text-[#6B7280]">
                Play subtle chime when a quick doubt arrives while online.
              </p>
            </div>
            <button
              onClick={() => setAudioPings(!audioPings)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                audioPings ? 'bg-[#3F6B5B]' : 'bg-[#E5EAE7]'
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

      {/* Account & Security */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5EAE7] space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#1F2933] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#3F6B5B]" />
          <span>Account &amp; Session</span>
        </h3>
        <p className="text-xs text-[#6B7280]">
          You are currently signed in as{' '}
          <strong className="text-[#1F2933] font-semibold">{currentUser?.fullName || 'Student'}</strong>{' '}
          ({currentUser?.email || 'Active Account'}).
        </p>
        <div className="pt-2">
          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of PeerLoop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
