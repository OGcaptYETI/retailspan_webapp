'use client';

import React from 'react';
import { Modal } from '@/app/components/ui/modal';
import { useTheme } from 'next-themes';
import { LogOut, Settings } from 'lucide-react';
import type { User } from '@supabase/auth-helpers-nextjs';

interface ProfileModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  className?: string;
}

const ProfileModal = ({ isOpen, user, onClose, onLogout, className }: ProfileModalProps) => {
  const { setTheme, theme } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={className}
      position="bottom-left" // Pass position as bottom-left
    >
      <div className="p-4 bg-gray-800 text-gray-100 rounded-lg shadow-lg w-60">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full">
            {user?.email?.[0]?.toUpperCase() || 'G'}
          </div>
          <div>
            <p className="text-sm font-bold">{user?.email || 'Guest'}</p>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="space-y-2">
          <button
            onClick={() => setTheme('dark')}
            className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 ${
              theme === 'dark' ? 'bg-cyan-500 text-gray-900' : 'hover:bg-cyan-500 hover:text-gray-900'
            }`}
          >
            <Settings size={16} />
            Dark Theme
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 ${
              theme === 'light' ? 'bg-cyan-500 text-gray-900' : 'hover:bg-cyan-500 hover:text-gray-900'
            }`}
          >
            <Settings size={16} />
            Light Theme
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 ${
              theme === 'system'
                ? 'bg-cyan-500 text-gray-900'
                : 'hover:bg-cyan-500 hover:text-gray-900'
            }`}
          >
            <Settings size={16} />
            System Theme
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-md text-left text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;

