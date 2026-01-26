import axios from 'axios';
import { MOCK_USER, MOCK_POSTS, MOCK_GROUPS, MOCK_CHATS } from './mockData';

// In a real app, this would be the actual backend URL
const API_URL = 'http://127.0.0.1:8001';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service object
export const api = {
  auth: {
    login: async (credentials: any) => {
      await delay(1000); // Simulate network
      // Return mock user and token
      return { user: MOCK_USER, access_token: 'mock_jwt_token_xyz' };
    },
    signup: async (data: any) => {
      await delay(1500);
      return { user: MOCK_USER, access_token: 'mock_jwt_token_xyz' };
    },
    me: async () => {
      await delay(500);
      return MOCK_USER;
    }
  },
  posts: {
    getFeed: async () => {
      await delay(800);
      return MOCK_POSTS;
    },
    create: async (data: any) => {
      await delay(1000);
      return {
        id: Math.random().toString(),
        author: MOCK_USER,
        content: data.caption,
        imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        isLiked: false
      };
    },
    like: async (id: string) => {
      await delay(200);
      return { success: true };
    }
  },
  groups: {
    getAll: async () => {
      await delay(600);
      return MOCK_GROUPS;
    },
    join: async (id: string) => {
      await delay(400);
      return { success: true };
    }
  },
  chats: {
    getAll: async () => {
      await delay(500);
      return MOCK_CHATS;
    }
  }
};
