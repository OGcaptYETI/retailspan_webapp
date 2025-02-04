"use client";

import React, { useState, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface TabProps {
  children: ReactNode;
  index?: number;
  onClick: () => void;
  isActive: boolean;
  className?: string;
}

interface TabListProps {
  children: ReactNode;
  activeIndex?: number;
  handleTabClick?: (index: number) => void;
}

interface TabPanelsProps {
  children: ReactNode;
}

interface TabPanelProps {
  children: ReactNode;
  isActive: boolean;
}

interface TabsProps {
  defaultIndex?: number;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultIndex = 0, children }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  // Separate out <TabList> and <TabPanels> from children
  const childrenArray = React.Children.toArray(children);
  const tabList = childrenArray.find((child): child is React.ReactElement => React.isValidElement(child) && child.type === TabList);
  const tabPanels = childrenArray.find((child): child is React.ReactElement => React.isValidElement(child) && child.type === TabPanels);

  return (
    <div className="w-full">
      {tabList &&
        React.cloneElement(tabList as React.ReactElement<TabListProps & { activeIndex: number; handleTabClick: (index: number) => void }>, {
          activeIndex,
          handleTabClick,
        })}
      {tabPanels &&
        React.cloneElement(tabPanels as React.ReactElement<TabPanelsProps & { activeIndex: number }>, { activeIndex })}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ 
  children, 
  onClick, 
  isActive, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md focus:outline-none",
        isActive
          ? "bg-card text-card-foreground shadow"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabPanels: React.FC<TabPanelsProps & { activeIndex?: number }> = ({
  children,
  activeIndex,
}) => (
  <div className="mt-4">
    {React.Children.map(children, (child, index) =>
      React.cloneElement(child as React.ReactElement<TabPanelProps>, {
        isActive: activeIndex === index,
      })
    )}
  </div>
);

export const TabPanel: React.FC<TabPanelProps> = ({ children, isActive }) => (
  <div className={cn(isActive ? "block" : "hidden", "p-4 bg-card rounded-md shadow-sm")}>
    {children}
  </div>
);

export const TabList: React.FC<TabListProps> = ({
  children,
  activeIndex,
  handleTabClick,
}) => {
  return (
    <div className="flex border-b border-border">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<TabProps>, {
            index,
            onClick: () => handleTabClick?.(index),
            isActive: index === activeIndex,
            className: (child as React.ReactElement<TabProps>).props.className
          });
        }
        return child;
      })}
    </div>
  );
};  

