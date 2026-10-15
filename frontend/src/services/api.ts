import { Opportunity, UserProfile, SavedOpportunity, NotificationItem, AIStatus } from '../types';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  // Opportunities
  async getOpportunities(params?: Record<string, string>): Promise<Opportunity[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/opportunities${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async getOpportunityDetails(id: number): Promise<Opportunity> {
    const res = await fetch(`${API_BASE}/opportunities/${id}`);
    if (!res.ok) throw new Error('Failed to fetch opportunity details');
    return res.json();
  },

  async trackRegistration(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/opportunities/${id}/track-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type: 'PAGE_OPENED' })
    });
    if (!res.ok) throw new Error('Failed to track registration');
    return res.json();
  },

  async markRegistered(id: number): Promise<{ status: string; is_registered: boolean }> {
    const res = await fetch(`${API_BASE}/opportunities/${id}/mark-registered`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle registered state');
    return res.json();
  },

  async liveSearch(query?: string): Promise<Opportunity[]> {
    const res = await fetch(`${API_BASE}/opportunities/live-search${query ? `?query=${encodeURIComponent(query)}` : ''}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to run live search');
    return res.json();
  },

  async getCategories(): Promise<{ topics: string[]; event_types: string[]; locations: string[]; organizers: string[] }> {
    const res = await fetch(`${API_BASE}/opportunities/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Recommendations & Deadlines
  async getRecommendations(): Promise<Opportunity[]> {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async getDontMiss(): Promise<Opportunity[]> {
    const res = await fetch(`${API_BASE}/recommendations/dont-miss`);
    if (!res.ok) throw new Error('Failed to fetch urgent recommendations');
    return res.json();
  },

  async getClosingSoon(): Promise<Opportunity[]> {
    const res = await fetch(`${API_BASE}/recommendations/closing-soon`);
    if (!res.ok) throw new Error('Failed to fetch closing soon opportunities');
    return res.json();
  },

  // Chat / RAG
  async sendChat(query: string) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to query assistant');
    return res.json();
  },

  // User Profile
  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async resetCieDemoProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile/reset-cie-demo`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset CIE profile');
    return res.json();
  },

  // Saved Opportunities & Reminders
  async getSaved(): Promise<SavedOpportunity[]> {
    const res = await fetch(`${API_BASE}/saved`);
    if (!res.ok) throw new Error('Failed to fetch saved opportunities');
    return res.json();
  },

  async saveOpportunity(opportunity_id: number, reminder_days_before = 3): Promise<SavedOpportunity> {
    const res = await fetch(`${API_BASE}/saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity_id, reminder_days_before }),
    });
    if (!res.ok) throw new Error('Failed to save opportunity');
    return res.json();
  },

  async unsaveOpportunity(opportunity_id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/saved/${opportunity_id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove saved opportunity');
  },

  async updateReminderDays(opportunity_id: number, reminder_days_before: number): Promise<void> {
    const res = await fetch(`${API_BASE}/saved/${opportunity_id}/reminder?reminder_days_before=${reminder_days_before}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to update reminder');
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: number): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'POST' });
  },

  async deleteNotification(id: number): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}`, { method: 'DELETE' });
  },

  // Admin
  async getAiStatus(): Promise<AIStatus> {
    const res = await fetch(`${API_BASE}/admin/ai-status`);
    if (!res.ok) throw new Error('Failed to fetch AI engine status');
    return res.json();
  },

  async setApiKey(apiKey: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/set-api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    if (!res.ok) throw new Error('Failed to set API key');
  },

  async resetDemoData(): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/reset-demo-data`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
  },

  async createOpportunity(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create opportunity');
    return res.json();
  },

  async deleteOpportunity(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete opportunity');
  },

  async markClosed(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/opportunities/${id}/close`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to close opportunity');
  },

  async runIngestion(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/run-ingestion`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run ingestion pipeline');
    return res.json();
  }
};
