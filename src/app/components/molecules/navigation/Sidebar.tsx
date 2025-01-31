'use client';

import React, { useState } from 'react';
import { NavLink } from '@/app/components/molecules/navigation/NavLink';
import { BoxSelect, DollarSign, Menu, Package, Home, User, Smile, } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import ProfileModal from '@/app/components/molecules/navigation/ProfileModal';

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const navigationItems = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: <Home className="w-6 h-6" />,
  },
  {
    href: '/pricing',
    label: 'Pricing',
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    href: '/products',
    label: 'Products',
    icon: <Package className="w-6 h-6" />,
  },
  {
    href: '/Promotions',
    label: 'Promotions',
    icon: <Smile className="w-6 h-6" />,
  },
  {
    href: '/planograms',
    label: 'Planograms',
    icon: <BoxSelect className="w-6 h-6" />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: initialIsCollapsed = true, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={cn(
        'fixed top-0 left-0 h-screen bg-gray-900 text-gray-100 border-r flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-full bg-cyan-400" />
        ) : (
          <span className="text-xl font-bold text-cyan-400">RetailSpan</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-cyan-400 hover:bg-gray-700 rounded-md"
        >
          {isCollapsed ? <Menu className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col items-center space-y-4">
          {navigationItems.map((item, index) => (
            <li key={item.href} className="w-full">
              {index === 1 && <hr className="my-2 border-gray-700" />}
              <NavLink
                href={item.href}
                className="flex items-center justify-center px-4 py-3 rounded-md text-gray-300 hover:bg-cyan-500 hover:text-gray-900 transition-colors duration-300 ease-in-out"
              >
                {item.icon}
                {!isCollapsed && <span className="ml-4">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="mt-auto px-4 py-4 border-t flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <User className="w-6 h-6 text-gray-300" />
          {!isCollapsed && user && (
            <div>
              <p className="text-sm font-medium text-gray-100">{user.email}</p>
            </div>
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          user={user}
          onClose={() => setIsModalOpen(false)}
          onLogout={handleLogout}
          className="bottom-left"
        />
      )}
    </aside>
  );
};

export default Sidebar;