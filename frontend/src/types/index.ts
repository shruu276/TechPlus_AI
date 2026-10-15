export interface Opportunity {
  id: number;
  title: string;
  organizer: string;
  description: string;
  event_type: string;
  topics: string[];
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  mode: string;
  eligibility: string;
  fee: number;
  fee_display: string;
  registration_deadline: string;

  // Official URLs
  registration_url?: string | null;
  official_website_url?: string | null;
  source_url?: string | null;
  source_name: string;
  source_verified: boolean;
  data_mode: 'demo' | 'live';
  registration_status: string;

  status: string;
  is_demo: boolean;
  what_you_will_learn: string[];
  skills_gained: string[];
  career_areas: string[];
  match_score: number;
  urgency_badge: string;
  urgency_text: string;
  urgency_rank: number;
  verdict: string;
  reasons: string[];
  why_attend_explanation: string;
  ratings: {
    career_value: number;
    skill_relevance: number;
    hands_on_value: number;
    networking: number;
    accessibility: number;
  };
  is_saved: boolean;
  is_user_registered?: boolean;
  user_opened_registration?: boolean;
}

export interface UserProfile {
  id: number;
  name: string;
  branch: string;
  year: string;
  college: string;
  graduation_year: number;
  interests: string[];
  preferred_event_types: string[];
  preferred_locations: string[];
  budget_preference: string;
}

export interface SavedOpportunity {
  id: number;
  opportunity_id: number;
  reminder_days_before: number;
  reminder_enabled: boolean;
  saved_at: string;
  opportunity?: Opportunity;
}

export interface NotificationItem {
  id: number;
  opportunity_id?: number;
  title: string;
  message: string;
  notification_type: string;
  urgency: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  opportunities?: Opportunity[];
  ai_engine?: string;
  extracted_entities?: Record<string, any>;
  is_registration_query?: boolean;
}

export interface AIStatus {
  gemini_configured: boolean;
  active_engine: string;
  masked_key?: string;
  fallback_ready: boolean;
}
