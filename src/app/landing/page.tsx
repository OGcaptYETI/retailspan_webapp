"use client";

import React from "react";
import { Button } from "@/app/components/atoms/buttons/Button";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-cyan-700 to-blue-800 text-center px-6 py-12">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Welcome to <span className="text-cyan-300">RetailSpan</span>
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
          Streamline your retail operations with powerful tools for planograms, dynamic pricing, and product management.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.push("/register")}
            className="px-6 py-3 bg-cyan-500 text-gray-900 rounded-lg hover:bg-cyan-600 transition-all"
          >
            Sign Up
          </Button>
          <Button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-gray-800 text-cyan-400 border border-cyan-400 rounded-lg hover:bg-gray-700 transition-all"
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="text-center">
            <div className="text-cyan-400 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Planogram Management</h3>
            <p className="text-gray-400">
              Drag-and-drop tools to design and manage your retail layouts with precision.
            </p>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-4xl mb-4">💵</div>
            <h3 className="text-xl font-bold text-white mb-2">Dynamic Pricing</h3>
            <p className="text-gray-400">
              Optimize pricing with promotional insights and competitor analysis.
            </p>
          </div>
          <div className="text-center">
            <div className="text-cyan-400 text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">Product Management</h3>
            <p className="text-gray-400">
              Centralized tools for product data, inventory tracking, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-6">What Our Users Say</h2>
          <p className="text-gray-400 italic">
            "RetailSpan has transformed the way we manage our stores. It's a game-changer!"
          </p>
          <p className="text-gray-400 italic">- Jane Doe, Retail Manager</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 py-6 text-center text-gray-400">
        <p>© {new Date().getFullYear()} RetailSpan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;




