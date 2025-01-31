'use client';

import React, { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TabsProps {
  defaultIndex?: number;
  children: ReactNode;
}

interface TabListProps {
  children: ReactNode;
}

interface TabPanelsProps {
  children: ReactNode;
}

interface TabProps {
  children: ReactNode;
  index: number;
  onClick: () => void;
  isActive: boolean;
}

interface TabPanelProps {
  children: ReactNode;
  isActive: boolean;
}

export const Tabs: React.FC<TabsProps> = ({ defaultIndex = 0, children }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  const childrenArray = React.Children.toArray(children);
  const tabList = childrenArray.find((child: any) => child.type === TabList);
  const tabPanels = childrenArray.find((child: any) => child.type === TabPanels);

  return (
    <div className="w-full">
      {tabList && React.cloneElement(tabList as React.ReactElement<any>, { activeIndex, handleTabClick })}
      {tabPanels && React.cloneElement(tabPanels as React.ReactElement<any>, { activeIndex })}
    </div>
  );
};

export const TabList: React.FC<TabListProps & { activeIndex?: number; handleTabClick?: (index: number) => void }> = ({
  children,
  activeIndex,
  handleTabClick,
}) => (
  <div className="flex space-x-2 bg-gray-900 text-white p-2 rounded-lg shadow-md">
    {React.Children.map(children, (child, index) =>
      React.cloneElement(child as React.ReactElement<TabProps>, {
        index,
        onClick: () => handleTabClick?.(index),
        isActive: activeIndex === index,
      })
    )}
  </div>
);

export const Tab: React.FC<TabProps> = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex-1 py-2 px-4 text-sm font-medium transition-all duration-300 rounded-md focus:outline-none',
      isActive
        ? 'bg-cyan-600 text-white shadow-md'
        : 'text-gray-400 hover:bg-cyan-500 hover:text-white'
    )}
  >
    {children}
  </button>
);

export const TabPanels: React.FC<TabPanelsProps & { activeIndex?: number }> = ({ children, activeIndex }) => (
  <div className="mt-4">
    {React.Children.map(children, (child, index) =>
      React.cloneElement(child as React.ReactElement<TabPanelProps>, {
        isActive: activeIndex === index,
      })
    )}
  </div>
);

export const TabPanel: React.FC<TabPanelProps> = ({ children, isActive }) => (
  <div className={cn(isActive ? 'block' : 'hidden', 'p-4 bg-gray-800 text-white rounded-lg shadow-md')}>
    {children}
  </div>
);

