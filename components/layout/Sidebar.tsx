import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, MessageSquare, GraduationCap, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store';

const NAV_ITEMS = [
  { icon: Home, label: 'Feed', path: '/' },
  { icon: Users, label: 'Groups', path: '/groups' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: GraduationCap, label: 'Alumni', path: '/alumni' },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const { user, logout } = useAuthStore();

  return (
    <div className={`${className} flex flex-col h-screen sticky top-0 border-r border-white/5 bg-[#09090b]/50 backdrop-blur-md pt-24 pb-8 px-4`}>
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}
            `}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        {/* Profile Link Special Case */}
        <NavLink
            to={`/profile/${user?.username}`}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group mt-6
              ${isActive 
                ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}
            `}
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </NavLink>
      </nav>

      <button 
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
};
