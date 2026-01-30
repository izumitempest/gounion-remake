import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = React.useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => api.posts.like(post.id),
    onMutate: async () => {
      // Snapshot previous value
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      // Optimistically update
      // (This is tricky with infinite query, so we'll do simple local state for now
      // but the 5s delay is usually because of awaiting the response)
    },
    onSuccess: (data) => {
      // Invalidate or update local state
    }
  });

  // Since PostCard is used in lists, simple local state is often better for immediate feedback
  const [liked, setLiked] = React.useState(post.isLiked);
  const [likesCount, setLikesCount] = React.useState(post.likes);

  // Sync state when props change (e.g. on feed refetch)
  React.useEffect(() => {
    setLiked(post.isLiked);
    setLikesCount(post.likes);
  }, [post.isLiked, post.likes]);

  const handleLike = async () => {
    // Immediate feedback
    const originalLiked = liked;
    const originalCount = likesCount;
    
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    try {
      const response = await api.posts.like(post.id);
      // Synchronize with server just in case
      setLikesCount(response.likes_count);
    } catch (error) {
      // Revert on error
      setLiked(originalLiked);
      setLikesCount(originalCount);
      console.error("Failed to like post:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      <GlassCard hoverEffect>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={post.author.avatarUrl} 
              alt={post.author.username} 
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <div>
              <h4 className="font-semibold text-zinc-100 text-sm hover:text-violet-400 cursor-pointer transition-colors">
                <Link to={`/profile/${post.author.username}`}>
                  {post.author.fullName}
                </Link>
              </h4>
              <p className="text-xs text-zinc-500">
                @{post.author.username} • {post.timestamp}
              </p>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-zinc-300">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <p className="text-zinc-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-zinc-900/50">
            {['mp4', 'webm', 'ogg'].some(ext => post.imageUrl?.toLowerCase().endsWith(ext)) ? (
              <video 
                src={post.imageUrl} 
                controls 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            ) : (
              <img 
                src={post.imageUrl} 
                alt="Post attachment" 
                className="w-full h-auto object-cover max-h-[500px]"
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm transition-colors group ${liked ? 'text-pink-500' : 'text-zinc-400 hover:text-pink-400'}`}
          >
            <Heart size={18} className={`transition-transform group-active:scale-125 ${liked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 text-sm transition-colors group ${showComments ? 'text-violet-400' : 'text-zinc-400 hover:text-violet-400'}`}
          >
            <MessageCircle size={18} className="group-active:scale-90 transition-transform" />
            <span>{post.comments}</span>
          </button>

          <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors ml-auto">
            <Share2 size={18} />
          </button>
        </div>

        {showComments && <CommentSection postId={post.id} />}
      </GlassCard>
    </motion.div>
  );
};
