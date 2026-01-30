import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Users, Image as ImageIcon, Send } from 'lucide-react';
import { api } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { PostCard } from '../components/feed/PostCard';
import { Skeleton } from '../components/ui/Skeleton';

export const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState('');

  const { data: group } = useQuery({
    queryKey: ['group', id],
    queryFn: () => api.groups.getAll().then(groups => groups.find((g: any) => g.id === id))
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['group-posts', id],
    queryFn: () => api.groups.getPosts(id!)
  });

  const createPostMutation = useMutation({
    mutationFn: (data: { caption: string }) => api.groups.createPost(id!, data),
    onSuccess: () => {
      setCaption('');
      queryClient.invalidateQueries({ queryKey: ['group-posts', id] });
    }
  });

  if (!group && !isLoading) return <div className="text-zinc-500 text-center py-20">Group not found</div>;

  return (
    <div className="max-w-3xl mx-auto w-full pb-20">
      <button 
        onClick={() => navigate('/groups')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Groups
      </button>

      <div className="relative h-48 rounded-3xl overflow-hidden mb-8 border border-white/5 shadow-2xl">
        <img src={group?.imageUrl} alt={group?.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{group?.name}</h1>
            <div className="flex items-center gap-2 text-zinc-300">
              <Users size={18} className="text-violet-400" />
              <span>{group?.memberCount} members</span>
            </div>
          </div>
          <button className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all">
            Invite
          </button>
        </div>
      </div>

      <GlassCard className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`Share something with ${group?.name}...`}
              className="w-full bg-transparent border-none focus:ring-0 text-zinc-200 placeholder:text-zinc-600 resize-none h-20 text-lg"
            />
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button className="flex items-center gap-2 text-zinc-500 hover:text-violet-400 transition-colors">
                <ImageIcon size={20} />
                <span className="text-sm font-medium">Add Photo</span>
              </button>
              <button 
                onClick={() => createPostMutation.mutate({ caption })}
                disabled={!caption.trim() || createPostMutation.isPending}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-violet-900/20 flex items-center gap-2"
              >
                <Send size={18} />
                Post
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        {isLoading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : (
          posts?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
        {!isLoading && posts?.length === 0 && (
          <div className="text-center py-10 text-zinc-600 italic">No posts in this group yet. Be the first!</div>
        )}
      </div>
    </div>
  );
};
