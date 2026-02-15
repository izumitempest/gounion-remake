import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Users, Image as ImageIcon, Send } from "lucide-react";
import { api } from "../services/api";
import { GlassCard } from "../components/ui/GlassCard";
import { PostCard } from "../components/feed/PostCard";
import { Skeleton } from "../components/ui/Skeleton";

export const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState("");

  const { data: group } = useQuery({
    queryKey: ["group", id],
    queryFn: () =>
      api.groups
        .getAll()
        .then((groups) => groups.find((g: any) => g.id === id)),
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["group-posts", id],
    queryFn: () => api.groups.getPosts(id!),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: { caption: string }) => api.groups.createPost(id!, data),
    onSuccess: () => {
      setCaption("");
      queryClient.invalidateQueries({ queryKey: ["group-posts", id] });
    },
  });

  if (!group && !isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-black text-white tracking-tighter mb-4">
          Group not found
        </h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
          The group you are looking for does not exist
        </p>
        <button
          onClick={() => navigate("/groups")}
          className="mt-8 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Back to Groups
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <button
        onClick={() => navigate("/groups")}
        className="flex items-center gap-3 text-zinc-500 hover:text-primary transition-all mb-8 group"
      >
        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-primary group-hover:text-black transition-all">
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">
          Back to Groups
        </span>
      </button>

      <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-12 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group">
        <img
          src={group?.imageUrl}
          alt={group?.name}
          className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />

        <div className="absolute top-6 right-8">
          <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(196,255,14,0.8)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Active Group
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 left-10 right-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Users size={20} className="text-primary" />
              </div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">
                Community
              </span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2 leading-none">
              {group?.name}
            </h1>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
              {group?.memberCount.toLocaleString()} Members
            </p>
          </div>
          <button className="px-8 py-4 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-105">
            Invite Link
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="!rounded-[2rem] overflow-hidden border-white/5 shadow-xl relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-focus-within:bg-primary/10 transition-all" />
            <div className="flex gap-4 p-2">
              <div className="flex-1">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`Share something with ${group?.name}...`}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-700 resize-none h-24 text-lg font-medium"
                />
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mx-2">
                  <button className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-white/5">
                    <ImageIcon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Add Photo
                    </span>
                  </button>
                  <button
                    onClick={() => createPostMutation.mutate({ caption })}
                    disabled={!caption.trim() || createPostMutation.isPending}
                    className="bg-primary text-black disabled:opacity-50 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/10 flex items-center gap-2 hover:opacity-90 active:scale-95"
                  >
                    <Send size={16} />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-6">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-[2.5rem]" />
                ))
              : posts?.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))}
            {!isLoading && posts?.length === 0 && (
              <div className="py-20 text-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                  No activity signals found in this cluster
                </p>
                <button className="mt-4 text-primary font-black text-[10px] uppercase tracking-widest hover:underline">
                  Sync first signal
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <GlassCard className="!rounded-[2rem] !p-8 border-white/5">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">
              Cluster Info
            </h4>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6">
              This academic node is dedicated to {group?.name}. Connect with
              peers, share resources, and sync your schedules.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                  Integrity
                </span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  98% Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                  Traffic
                </span>
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                  High Flow
                </span>
              </div>
            </div>
          </GlassCard>

          <div className="bg-primary text-black p-8 rounded-[2rem] shadow-2xl shadow-primary/20 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <h4 className="font-black text-xs uppercase tracking-widest mb-2 relative z-10">
              Sync Schedule
            </h4>
            <p className="text-[10px] font-bold uppercase tracking-tight relative z-10 opacity-70">
              Automate your academic flow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
