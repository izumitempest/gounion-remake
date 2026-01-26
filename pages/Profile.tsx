import React from 'react';
import { useAuthStore } from '../store';
import { GlassCard } from '../components/ui/GlassCard';
import { MapPin, Calendar, Link as LinkIcon } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <div className="relative mb-20">
        <div className="h-64 rounded-3xl overflow-hidden">
          <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="p-1.5 rounded-2xl bg-[#09090b]">
             <img src={user.avatarUrl} alt="Profile" className="w-32 h-32 rounded-xl object-cover border-2 border-white/10" />
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white">{user.fullName}</h1>
            <p className="text-zinc-400">@{user.username}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-8 flex gap-3">
            <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">Edit Profile</button>
            <button className="bg-violet-600 text-white px-6 py-2 rounded-xl hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/30">Share</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-zinc-100 font-semibold mb-4">About</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {user.bio}
            </p>
            <div className="space-y-3 text-sm text-zinc-500">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-violet-400" />
                <span>{user.university}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-violet-400" />
                <span>Joined September 2021</span>
              </div>
              <div className="flex items-center gap-3">
                <LinkIcon size={16} className="text-violet-400" />
                <a href="#" className="text-violet-400 hover:underline">github.com/alexrivers</a>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex justify-between text-center">
              <div>
                <div className="text-xl font-bold text-white">{user.followers}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mt-1">Followers</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-xl font-bold text-white">{user.following}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mt-1">Following</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="flex gap-2 border-b border-white/10 pb-1">
             <button className="px-6 py-3 text-violet-400 border-b-2 border-violet-500 font-medium">Posts</button>
             <button className="px-6 py-3 text-zinc-500 hover:text-zinc-300 transition-colors">Media</button>
             <button className="px-6 py-3 text-zinc-500 hover:text-zinc-300 transition-colors">Likes</button>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/5 border-dashed">
            <p className="text-zinc-500">No recent activity to show</p>
          </div>
        </div>
      </div>
    </div>
  );
};
