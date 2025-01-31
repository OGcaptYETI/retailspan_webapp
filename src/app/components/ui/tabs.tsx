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
  index?: number;
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
    <div>
      {tabList && React.cloneElement(tabList as React.ReactElement<any>, { activeIndex, handleTabClick })}
      {tabPanels &&
        React.cloneElement(tabPanels as React.ReactElement<any>, { activeIndex })}
    </div>
  );
};

export const TabList: React.FC<TabListProps & { activeIndex?: number; handleTabClick?: (index: number) => void }> = ({
  children,
  activeIndex,
  handleTabClick,
}) => (
  <div className="flex space-x-4 border-b border-gray-300 mb-4">
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
      'py-2 px-4 text-sm font-medium transition',
      isActive
        ? 'border-b-2 border-cyan-500 text-cyan-500'
        : 'text-gray-500 hover:text-cyan-500 hover:border-cyan-500'
    )}
  >
    {children}
  </button>
);

export const TabPanels: React.FC<TabPanelsProps & { activeIndex?: number }> = ({
  children,
  activeIndex,
}) => (
  <div>
    {React.Children.map(children, (child, index) =>
      React.cloneElement(child as React.ReactElement<TabPanelProps>, {
        index,
        isActive: activeIndex === index,
      })
    )}
  </div>
);

export const TabPanel: React.FC<TabPanelProps> = ({ children, isActive }) => (
  <div className={cn(isActive ? 'block' : 'hidden')}>{children}</div>
);
