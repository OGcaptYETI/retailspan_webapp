'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-gray-800 text-gray-100 p-6 border-b border-gray-700">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-cyan-400">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;