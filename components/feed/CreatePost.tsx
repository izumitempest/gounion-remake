import React, { useState } from 'react';
import { Image, Send } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useAuthStore } from '../../store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

export const CreatePost = () => {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: api.posts.create,
    onSuccess: (newPost) => {
      queryClient.setQueryData(['feed'], (old: any) => [newPost, ...(old || [])]);
      setContent('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ caption: content });
  };

  return (
    <GlassCard className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <img 
            src={user?.avatarUrl} 
            alt={user?.username} 
            className="w-10 h-10 rounded-full object-cover border border-white/10"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening on campus?"
              className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-600 resize-none h-20 text-lg"
            />
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
              <button type="button" className="text-zinc-400 hover:text-violet-400 transition-colors p-2 rounded-lg hover:bg-white/5">
                <Image size={20} />
              </button>
              <button 
                type="submit"
                disabled={!content.trim() || mutation.isPending}
                className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                {mutation.isPending ? 'Posting...' : (
                  <>
                    <span>Post</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </GlassCard>
  );
};
