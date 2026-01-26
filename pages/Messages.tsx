import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, Phone, Video, MoreVertical, Search } from 'lucide-react';
import { api } from '../services/api';
import { Chat } from '../types';

export const Messages = () => {
  const { data: chats } = useQuery({ queryKey: ['chats'], queryFn: api.chats.getAll });
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');

  const selectedChat = chats?.find(c => c.id === selectedChatId);

  return (
    <div className="h-[calc(100vh-6rem)] flex rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-sm">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-white/5 flex flex-col ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats?.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`p-4 flex gap-3 cursor-pointer transition-colors ${selectedChatId === chat.id ? 'bg-violet-500/10 border-l-2 border-violet-500' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
            >
              <div className="relative">
                <img src={chat.partner.avatarUrl} alt={chat.partner.username} className="w-12 h-12 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#09090b] rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`font-semibold text-sm truncate ${selectedChatId === chat.id ? 'text-violet-200' : 'text-zinc-200'}`}>{chat.partner.fullName}</h4>
                  <span className="text-xs text-zinc-500">{chat.timestamp}</span>
                </div>
                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-zinc-100 font-medium' : 'text-zinc-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="flex items-center">
                  <span className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-[10px] text-white">{chat.unreadCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedChatId(null)} className="md:hidden text-zinc-400 mr-2">←</button>
                <img src={selectedChat.partner.avatarUrl} alt="User" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-zinc-100">{selectedChat.partner.fullName}</h3>
                  <span className="text-xs text-emerald-500 flex items-center gap-1">● Online</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-zinc-400">
                <button className="hover:text-violet-400 transition-colors"><Phone size={20} /></button>
                <button className="hover:text-violet-400 transition-colors"><Video size={20} /></button>
                <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="flex justify-center">
                <span className="bg-white/5 text-zinc-500 text-xs px-3 py-1 rounded-full">Today</span>
              </div>
              {/* Mock Messages */}
              <div className="flex gap-3">
                 <img src={selectedChat.partner.avatarUrl} className="w-8 h-8 rounded-full self-end mb-1" />
                 <div className="bg-white/10 text-zinc-200 p-3 rounded-2xl rounded-bl-none max-w-[70%]">
                    Hey! Are you going to the CS mixer tonight? 🚀
                 </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                 <div className="bg-violet-600 text-white p-3 rounded-2xl rounded-br-none max-w-[70%] shadow-lg shadow-violet-900/20">
                    Yeah, I'll be there around 7!
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-200 placeholder:text-zinc-600"
                />
                <button className="text-zinc-500 hover:text-violet-400 transition-colors"><Send size={20} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
               <Send size={32} className="opacity-50" />
            </div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};
