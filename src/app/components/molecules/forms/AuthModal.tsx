"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/config";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setMessage("Error signing in. Please try again.");
    } else {
      setMessage("Check your email for the sign-in link!");
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-[hsl(var(--card))] text-[hsl(var(--foreground))] rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[hsl(var(--primary))]">
          Sign In
        </h2>
        <p className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
          Enter your email to access your dashboard.
        </p>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[hsl(var(--secondary-foreground))] mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[hsl(var(--border))] rounded-md bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-md hover:bg-[hsl(var(--accent-hover))] transition-all focus:outline-none focus:ring focus:ring-[hsl(var(--ring))]"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;


