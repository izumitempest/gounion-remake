import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '../../store';

export const MobileNav = () => {
  const { user } = useAuthStore();
  const NAV_ITEMS = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: MessageSquare, label: 'Chat', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-2">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center p-2 rounded-xl transition-all
            ${isActive ? 'text-violet-400' : 'text-zinc-500'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} className={isActive ? 'fill-current' : ''} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};