export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
}

export interface Kudos {
  id: number;
  giver_id: number;
  recipient_id: number;
  message: string;
  is_visible: boolean;
  created_at: string;
  giver_username?: string;
  recipient_username?: string;
}

export interface ModerationLog {
  id: number;
  kudos_id: number;
  admin_id: number;
  action: 'hide' | 'delete' | 'restore';
  reason?: string;
  created_at: string;
  admin_username?: string;
}
