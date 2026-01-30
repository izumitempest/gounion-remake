import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/Skeleton';
import { MapPin, Calendar, Link as LinkIcon, Users } from 'lucide-react';

export const Profile = () => {
  const { username } = useParams<{ username: string }>();
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => api.profiles.get(username || ''),
    enabled: !!username,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['profile-posts', username],
    queryFn: () => api.profiles.getPosts(username || ''),
    enabled: !!username,
  });

  const [isFollowing, setIsFollowing] = React.useState(false);

  const handleFollow = async () => {
    if (!user) return;
    try {
      if (isFollowing) {
        await api.profiles.unfollow(user.id);
      } else {
        await api.profiles.follow(user.id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full pb-20 space-y-8 animate-pulse">
        <div className="h-64 rounded-3xl bg-white/5" />
        <div className="flex gap-6 px-8">
          <div className="w-32 h-32 rounded-xl bg-white/10 -mt-16 border-2 border-[#09090b]" />
          <div className="space-y-2 mt-4">
            <div className="h-8 w-48 bg-white/10 rounded" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="max-w-4xl mx-auto w-full py-20 text-center">
        <Users size={48} className="mx-auto text-zinc-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">User Not Found</h2>
        <p className="text-zinc-500">The profile you're looking for doesn't exist or is private.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <div className="relative mb-20">
        <div className="h-64 rounded-3xl overflow-hidden bg-zinc-900">
          {user.coverUrl ? (
            <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 to-violet-900/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="p-1.5 rounded-2xl bg-[#09090b]">
             <img 
               src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
               alt="Profile" 
               className="w-32 h-32 rounded-xl object-cover border-2 border-white/10" 
             />
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white">{user.fullName || user.username}</h1>
            <p className="text-zinc-400">@{user.username}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-8 flex gap-3">
            <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">Message</button>
            <button 
              onClick={handleFollow}
              className={`${isFollowing ? 'bg-zinc-800' : 'bg-violet-600 hover:bg-violet-500'} text-white px-6 py-2 rounded-xl transition-colors shadow-lg shadow-violet-900/30 font-medium`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-zinc-100 font-semibold mb-4">About</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {user.bio || "No bio yet."}
            </p>
            <div className="space-y-3 text-sm text-zinc-500">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-violet-400" />
                <span>{user.university}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-violet-400" />
                <span>Joined GoUnion</span>
              </div>
              <div className="flex items-center gap-3">
                <LinkIcon size={16} className="text-violet-400" />
                <a href="#" className="text-violet-400 hover:underline">Community Profile</a>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex justify-between text-center">
              <div>
                <div className="text-xl font-bold text-white">{user.followers || 0}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide mt-1">Followers</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-xl font-bold text-white">{user.following || 0}</div>
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
          
          <div className="space-y-4">
            {postsLoading ? (
              <Skeleton className="h-48 w-full rounded-2xl" />
            ) : posts && posts.length > 0 ? (
              <div className="text-zinc-500 text-center py-10">
                Loaded {posts.length} posts by @{user.username}
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/5 border-dashed">
                <p className="text-zinc-500">No posts yet from this user</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
