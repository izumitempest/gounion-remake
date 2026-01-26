import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { Link } from 'react-router-dom';

export const TopNav = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-zinc-400" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="font-bold text-white text-lg">G</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            GoUnion
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-lg mx-4 md:mx-12 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for people, groups, or posts..."
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-zinc-900/80 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
        </button>
        
        <Link to={`/profile/${user?.username}`}>
            <img 
            src={user?.avatarUrl || "https://picsum.photos/100"} 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover border border-white/10 hover:border-violet-500 transition-colors"
            />
        </Link>
      </div>
    </header>
  );
};
