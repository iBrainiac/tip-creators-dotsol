const API_BASE_URL = 'http://localhost:3001/api';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  walletAddress: string;
  totalTips: number;
  followers: number;
  isOnline: boolean;
  tags: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
    discord?: string;
    website?: string;
  };
  createdAt: string;
  lastActive: string;
}

export interface Tip {
  id: string;
  creatorId: string;
  contentId?: string; // Link tip to specific content
  tipperId: string;
  amount: number;
  message: string;
  timestamp: string;
  transactionHash: string;
}

export interface Content {
  id: string;
  creatorId: string;
  type: 'NFT' | 'ART' | 'POST' | 'STREAM' | 'VIDEO' | 'MUSIC';
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  tipEnabled: boolean;
  tipGoal?: number; // Optional tip goal for the content
  totalTips: number;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContentResponse {
  content: Content[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatorsResponse {
  creators: Creator[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Creators
  async getCreators(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<CreatorsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const endpoint = `/creators${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CreatorsResponse>(endpoint);
  }

  async getCreator(id: string): Promise<Creator & { tips: Tip[] }> {
    return this.request<Creator & { tips: Tip[] }>(`/creators/${id}`);
  }

  async getCreatorDetails(id: string): Promise<Creator> {
    return this.request<Creator>(`/creators/${id}/details`);
  }

  // Content methods
  async getContent(params?: {
    page?: number;
    limit?: number;
    creatorId?: string;
    type?: string;
    tag?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<ContentResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.creatorId) queryParams.append('creatorId', params.creatorId);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const endpoint = `/content${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ContentResponse>(endpoint);
  }

  async getContentById(id: string): Promise<Content> {
    return this.request<Content>(`/content/${id}`);
  }

  async createContent(contentData: {
    creatorId: string;
    type: string;
    title: string;
    description: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    tags?: string[];
    tipEnabled?: boolean;
    tipGoal?: number;
  }): Promise<Content> {
    return this.request<Content>('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  async updateContent(id: string, updates: Partial<Content>): Promise<Content> {
    return this.request<Content>(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteContent(id: string): Promise<void> {
    return this.request<void>(`/content/${id}`, {
      method: 'DELETE',
    });
  }

  async getCreatorContent(creatorId: string): Promise<Content[]> {
    return this.request<Content[]>(`/creators/${creatorId}/content`);
  }

  async getTrendingCreators(): Promise<Creator[]> {
    return this.request<Creator[]>('/creators/trending');
  }

  async getOnlineCreators(): Promise<Creator[]> {
    return this.request<Creator[]>('/creators/online');
  }

  async searchCreators(query: string): Promise<Creator[]> {
    return this.request<Creator[]>(`/creators/search/${encodeURIComponent(query)}`);
  }

  async createCreator(creatorData: {
    name: string;
    handle: string;
    bio: string;
    walletAddress: string;
    avatar?: string;
    tags?: string[];
    socialLinks?: Record<string, string>;
  }): Promise<Creator> {
    return this.request<Creator>('/creators', {
      method: 'POST',
      body: JSON.stringify(creatorData),
    });
  }

  async updateCreator(id: string, updates: Partial<Creator>): Promise<Creator> {
    return this.request<Creator>(`/creators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Tips
  async recordTip(tipData: {
    creatorId: string;
    tipperId: string;
    amount: number;
    message?: string;
    transactionHash: string;
  }): Promise<Tip> {
    return this.request<Tip>('/tips', {
      method: 'POST',
      body: JSON.stringify(tipData),
    });
  }

  async getCreatorTips(creatorId: string): Promise<Tip[]> {
    return this.request<Tip[]>(`/creators/${creatorId}/tips`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Social Media Posts
  async getSocialPosts(params?: {
    platform?: string;
    creatorId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    posts: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.platform) queryParams.append('platform', params.platform);
    if (params?.creatorId) queryParams.append('creatorId', params.creatorId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/social-posts${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async createSocialPost(postData: {
    platform: string;
    creatorId: string;
    content: string;
    mediaUrls?: string[];
    engagement?: any;
    url?: string;
    tags?: string[];
  }): Promise<any> {
    return this.request('/social-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updateSocialPostTips(postId: string, amount: number): Promise<any> {
    return this.request(`/social-posts/${postId}/tips`, {
      method: 'PUT',
      body: JSON.stringify({ amount }),
    });
  }

  async getCreatorSocialPosts(creatorId: string): Promise<any[]> {
    return this.request(`/creators/${creatorId}/social-posts`);
  }
}

export const apiService = new ApiService(); 