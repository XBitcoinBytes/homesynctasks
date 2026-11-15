import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useHousehold } from '@/hooks/use-household';
import { BitcoinDonationModal } from '@/components/donation-modal';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { appUser, logout } = useAuth();
  const { household, members } = useHousehold();
  const [showDonationModal, setShowDonationModal] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'fas fa-tachometer-alt' },
    { name: 'Task Library', href: '/task-library', icon: 'fas fa-tasks' },
    { name: 'Rooms & Zones', href: '/rooms-zones', icon: 'fas fa-map-marker-alt' },
    { name: 'Schedule', href: '/schedule', icon: 'fas fa-calendar-alt' },
    { name: 'Analytics', href: '/analytics', icon: 'fas fa-chart-line' },
    { name: 'Settings', href: '/settings', icon: 'fas fa-cog' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!appUser || !household) return null;

  return (
    <div className={`hidden md:flex md:flex-shrink-0 ${className}`}>
      <div className="flex flex-col w-64 bg-white border-r border-slate-200">
        {/* Household Selector */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-300">
                <span className="text-white text-lg font-bold">🏠</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text">{household.name}</h2>
                <p className="text-sm text-purple-600 font-semibold">{members.length} members</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-chevron-down text-xs"></i>
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 interactive-depth relative overflow-hidden group ${
                  isActive
                    ? 'text-slate-900 bg-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-30"></div>
                  <i className={`${item.icon} w-5 h-5 mr-3 relative z-10 group-hover:animate-pulse ${isActive ? 'text-primary-600' : ''}`}></i>
                  <span className="relative z-10">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Bitcoin Donation Section */}
        <div className="p-4 border-t border-slate-200">
          <Button
            onClick={() => setShowDonationModal(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-lg">💝</span>
            Support Project
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getInitials(appUser.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{appUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{appUser.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-slate-400 hover:text-slate-600"
            >
              <i className="fas fa-sign-out-alt text-sm"></i>
            </Button>
          </div>
        </div>
      </div>

      <BitcoinDonationModal 
        isOpen={showDonationModal} 
        onClose={() => setShowDonationModal(false)} 
      />
    </div>
  );
}
