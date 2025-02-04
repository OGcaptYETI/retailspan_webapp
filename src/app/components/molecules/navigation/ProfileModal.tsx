"use client";

import React, { useState } from "react";
import { Modal } from "@/app/components/ui/modal";
import { useTheme } from "next-themes";
import {
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/app/components/atoms/buttons/Button";

interface ProfileModalProps {
  isOpen: boolean;
  user: SupabaseUser | null;
  onClose: () => void;
  onLogout: () => void;
  className?: string;
}

const ProfileModal = ({ isOpen, user, onClose, onLogout, className }: ProfileModalProps) => {
  const { setTheme, theme } = useTheme();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const themeOptions = [
    { value: "light", label: "Light Theme", icon: Sun },
    { value: "dark", label: "Dark Theme", icon: Moon },
    { value: "system", label: "System Theme", icon: Monitor },
  ];

  const menuItems = [
    {
      icon: User,
      label: "Account Settings",
      onClick: () => console.log("Navigate to account settings"),
      description: "Manage your account details",
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      onClick: () => console.log("Navigate to security settings"),
      description: "Update your security preferences",
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => console.log("Navigate to notifications"),
      description: "Manage your notifications",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => console.log("Navigate to help"),
      description: "Get help or report an issue",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className} position="bottom-left">
      <div className="w-80 bg-card text-card-foreground rounded-lg shadow-lg divide-y divide-border transition-all">
        {/* User Profile Section */}
        <div className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-xl">
            {user?.email?.[0]?.toUpperCase() || "G"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email || "Guest"}</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full flex items-center justify-between px-3 py-3 h-auto transition-all"
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          ))}
        </div>

        {/* Theme Selection */}
        <div className="p-2">
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground">APPEARANCE</p>
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => setTheme(option.value)}
              className={`w-full flex items-center px-3 py-3 h-auto rounded-md transition-all ${
                theme === option.value
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "hover:bg-accent/20"
              }`}
            >
              <option.icon className="w-4 h-4 mr-3" />
              {option.label}
            </Button>
          ))}
        </div>

        {/* Logout Confirmation */}
        <div className="p-2">
          {confirmLogout ? (
            <div className="flex flex-col space-y-2 p-3 bg-destructive/10 rounded-md">
              <p className="text-sm text-center text-muted-foreground">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-between">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => setConfirmLogout(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setConfirmLogout(true)}
              className="w-full flex items-center px-3 py-3 text-destructive hover:text-destructive-foreground hover:bg-destructive transition-all"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;

