import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users as UsersIcon } from 'lucide-react';
import { api } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Group } from '../types';

export const Groups = () => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: api.groups.getAll
  });

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Community Groups</h1>
        <p className="text-zinc-400">Find your tribe and connect with like-minded students.</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search groups..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group: Group) => (
            <GlassCard key={group.id} hoverEffect className="flex flex-col h-full">
              <div className="relative h-32 -mx-6 -mt-6 mb-4 bg-zinc-800 overflow-hidden">
                <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent opacity-90" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
                  <UsersIcon size={14} />
                  <span>{group.memberCount.toLocaleString()} members</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{group.description}</p>
              </div>

              <button className={`w-full py-2.5 rounded-xl font-medium transition-all ${
                group.isJoined 
                  ? 'bg-white/5 text-zinc-300 hover:bg-white/10' 
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20'
              }`}>
                {group.isJoined ? 'Joined' : 'Join Group'}
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
