import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreatePost } from '../components/feed/CreatePost';
import { PostCard } from '../components/feed/PostCard';
import { api } from '../services/api';
import { Post } from '../types';

export const Dashboard = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: api.posts.getFeed
  });

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 md:pb-0">
      <div className="flex items-center justify-between mb-6 sticky top-16 z-30 bg-[#09090b]/80 backdrop-blur-md py-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Your Feed</h1>
        <select className="bg-zinc-900 border border-white/10 rounded-lg text-sm text-zinc-400 py-1 px-3 focus:outline-none focus:border-violet-500">
          <option>All Posts</option>
          <option>Following</option>
          <option>Groups</option>
        </select>
      </div>

      <CreatePost />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {posts?.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
