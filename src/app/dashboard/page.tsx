'use client';

import React from 'react';
import Sidebar from '@/app/components/molecules/navigation/Sidebar';

const DashboardPage = () => {
  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar imported here */}
      <main className="flex-1 bg-gray-900 text-gray-100 p-6 pl-8 ml-4">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-cyan-400 mb-6">
      Welcome to Your Dashboard
    </h1>
    <p className="text-gray-400 text-lg leading-relaxed">
      Use the navigation menu to manage your planograms, pricing, and product data.
    </p>
  </div>
</main>
    </div>
  );
};

export default DashboardPage;




