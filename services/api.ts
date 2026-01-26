import axios from 'axios';

const API_URL = 'http://127.0.0.1:8001';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add interceptor to include token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to transform user data
const transformUser = (user: any) => ({
  id: user.id,
  username: user.username,
  fullName: user.username, // Using username as fullName if not provided
  avatarUrl: user.profile?.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
  university: user.profile?.university || 'University Student',
  followers: 0, // Need endpoints for these or compute from data
  following: 0,
  bio: user.profile?.bio || '',
  coverUrl: user.profile?.cover_photo || '',
});

// Helper to transform post data
const transformPost = (post: any) => ({
  id: post.id.toString(),
  author: transformUser(post.user),
  content: post.caption || '',
  imageUrl: post.image,
  likes: post.likes_count || 0,
  comments: post.comments?.length || 0,
  timestamp: new Date(post.created_at).toLocaleDateString(),
  isLiked: false, // This needs checking against current user in real app
});

export const api = {
  auth: {
    login: async (credentials: any) => {
      const formData = new FormData();
      formData.append('username', credentials.email); // OAuth2 expects username
      formData.append('password', credentials.password);
      
      const res = await apiClient.post('/token', formData);
      localStorage.setItem('access_token', res.data.access_token);
      
      const userRes = await apiClient.get('/users/me/');
      const transformedUser = transformUser(userRes.data);
      return { user: transformedUser, access_token: res.data.access_token };
    },
    signup: async (data: any) => {
      const res = await apiClient.post('/users/', {
        username: data.username,
        email: data.email,
        password: data.password
      });
      
      // Auto-login after signup
      return api.auth.login({ email: data.email, password: data.password });
    },
    me: async () => {
      const res = await apiClient.get('/users/me/');
      return transformUser(res.data);
    }
  },
  posts: {
    getFeed: async ({ pageParam = 0 }: { pageParam?: number } = {}) => {
      const res = await apiClient.get(`/posts/?skip=${pageParam * 10}&limit=10`);
      return res.data.map(transformPost);
    },
    create: async (data: any) => {
      let imageUrl = null;
      if (data.image) {
        const formData = new FormData();
        formData.append('file', data.image);
        const uploadRes = await apiClient.post('/upload/', formData);
        imageUrl = uploadRes.data.url;
      }
      
      const res = await apiClient.post('/posts/', {
        caption: data.caption,
        image: imageUrl
      });
      return transformPost(res.data);
    },
    like: async (id: string) => {
      const res = await apiClient.post(`/posts/${id}/like`);
      return { success: true, likes_count: res.data.likes_count };
    }
  },
  groups: {
    getAll: async () => {
      const res = await apiClient.get('/groups/');
      return res.data.map((g: any) => ({
        id: g.id.toString(),
        name: g.name,
        description: g.description,
        memberCount: 0, // Need to implement member count in backend properly
        imageUrl: g.cover_image || `https://api.dicebear.com/7.x/identicon/svg?seed=${g.name}`,
        isJoined: false
      }));
    },
    join: async (id: string) => {
      const res = await apiClient.post(`/groups/${id}/join`);
      return { success: true };
    }
  },
  chats: {
    getAll: async () => {
      // Mocked for now as Phase 4 of backend is messaging
      return [];
    }
  },
  notifications: {
    getAll: async () => {
      const res = await apiClient.get('/notifications/');
      return res.data.map((n: any) => ({
        id: n.id.toString(),
        type: n.type,
        actor: transformUser(n.sender),
        message: `${n.sender.username} ${n.type}ed your post`,
        timestamp: new Date(n.created_at).toLocaleDateString(),
        read: n.is_read
      }));
    }
  }
};
