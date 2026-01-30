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
const transformUser = (user: any) => {
  const getFullUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  return {
    id: user.id,
    username: user.username,
    fullName: user.username, // Using username as fullName if not provided
    avatarUrl: getFullUrl(user.profile?.profile_picture) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
    university: user.profile?.university || 'University Student',
    followers: 0,
    following: 0,
    bio: user.profile?.bio || '',
    coverUrl: getFullUrl(user.profile?.cover_photo) || '',
  };
};

// Helper to transform post data
const transformPost = (post: any) => {
  const getFullUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  return {
    id: post.id.toString(),
    author: transformUser(post.user),
    content: post.caption || '',
    imageUrl: getFullUrl(post.image),
    likes: post.likes_count || 0,
    comments: post.comments?.length || 0,
    timestamp: new Date(post.created_at).toLocaleDateString(),
    isLiked: false,
  };
};

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
    },
    getComments: async (id: string) => {
      const res = await apiClient.get(`/posts/${id}/comments`);
      return res.data;
    },
    createComment: async (id: string, content: string) => {
      const res = await apiClient.post(`/posts/${id}/comments/`, { content });
      return res.data;
    }
  },
  profiles: {
    get: async (username: string) => {
      const res = await apiClient.get(`/profiles/${username}`);
      // The backend returns a Profile object, which is slightly different
      // but transformUser expects a User object with a profile nested.
      // We need to fetch the user too if we want a full User object.
      // For now, let's assume we want to transform the profile into our User type.
      // Actually, let's check what /profiles/{username} returns.
      // Backend: return user.profile
      return {
        id: res.data.user_id,
        username: username,
        fullName: username, // Should probably come from user
        avatarUrl: res.data.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        university: res.data.university || 'University Student',
        followers: 0,
        following: 0,
        bio: res.data.bio || '',
        coverUrl: res.data.cover_photo || '',
      };
    },
    getPosts: async (username: string) => {
      // Backend doesn't have a direct /users/{username}/posts for now
      // Using /posts/ and filtering client side or just showing all for now
      // Actually, let's look at crud.py. It has get_posts_by_university but not by user.
      // I might need to add one or just use /posts/ and filter.
      const res = await apiClient.get(`/posts/?limit=100`);
      return res.data
        .filter((p: any) => p.user.username === username)
        .map(transformPost);
    },
    follow: async (userId: string) => {
      const res = await apiClient.post(`/users/${userId}/follow`);
      return res.data;
    },
    unfollow: async (userId: string) => {
      const res = await apiClient.post(`/users/${userId}/unfollow`);
      return res.data;
    }
  },
  groups: {
    getAll: async () => {
      const res = await apiClient.get('/groups/');
      return res.data.map((g: any) => ({
        id: g.id.toString(),
        name: g.name,
        description: g.description,
        memberCount: 0,
        imageUrl: g.cover_image || `https://api.dicebear.com/7.x/identicon/svg?seed=${g.name}`,
        isJoined: false
      }));
    },
    join: async (id: string) => {
      const res = await apiClient.post(`/groups/${id}/join`);
      return { success: true };
    }
  },
  friends: {
    getAll: async () => {
      const res = await apiClient.get('/friends/');
      return res.data.map(transformUser);
    }
  },
  chats: {
    getAll: async () => {
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
