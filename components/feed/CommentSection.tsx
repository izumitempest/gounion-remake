import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Skeleton } from '../ui/Skeleton';
import { Send } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => api.posts.getComments(postId),
  });

  const createCommentMutation = useMutation({
    mutationFn: (text: string) => api.posts.createComment(postId, text),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || createCommentMutation.isPending) return;
    createCommentMutation.mutate(content);
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 transition-all"
        />
        <button 
          type="submit"
          disabled={!content.trim() || createCommentMutation.isPending}
          className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 disabled:opacity-50 transition-all"
        >
          <Send size={18} />
        </button>
      </form>

      <div className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded-xl" />
        ) : (
          comments?.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <img 
                src={comment.user.profile?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.username}`} 
                alt={comment.user.username} 
                className="w-8 h-8 rounded-full object-cover border border-white/5"
              />
              <div className="flex-1 bg-white/5 rounded-2xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-zinc-100 italic">@{comment.user.username}</span>
                  <span className="text-[10px] text-zinc-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
        {comments?.length === 0 && (
          <p className="text-center text-xs text-zinc-600 italic py-2">No comments yet. Be the first to say something!</p>
        )}
      </div>
    </div>
  );
};
