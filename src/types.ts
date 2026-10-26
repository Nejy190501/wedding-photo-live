import { User } from 'firebase/auth';

export type Role = 'landing' | 'host' | 'guest';
export type ActiveTab = 'qr' | 'gallery' | 'slideshow' | 'guide' | 'moderation';

export interface WeddingSession {
  active: boolean;
  weddingName?: string;
  weddingDate?: string;
  folderName?: string;
  guestGalleryEnabled?: boolean;
  themeColor?: string;
  moderationEnabled?: boolean;
  hostEmail?: string;
  hostName?: string;
}

export interface Photo {
  id: string;
  name: string;
  createdTime: string;
  guestName: string;
  caption: string;
  url: string;
  thumbnailUrl: string;
  likes?: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface HostConfig {
  weddingName: string;
  weddingDate?: string;
  themeColor: string;
  guestGalleryEnabled?: boolean;
  hostEmail?: string;
  hostName?: string;
}

export type ThemeColor = 'rose' | 'amber' | 'violet' | 'emerald' | 'slate';

export interface ThemeStyles {
  bg: string;
  primary: string;
  accent: string;
  text: string;
  border: string;
  btn: string;
  gradient: string;
}
