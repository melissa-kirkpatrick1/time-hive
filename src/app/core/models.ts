export interface CurrentUser {
  username: string;
  email: string | null;
  name: string | null;
  roles: string[];
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  /** ISO date string, e.g. "2026-10-01" */
  posted: string;
  pinned: boolean;
}

export interface Person {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  extension: string;
  email: string;
  outToday: boolean;
}

export type RoomAvailability = 'free' | 'busy' | 'maintenance';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  features: string[];
  availability: RoomAvailability;
}
