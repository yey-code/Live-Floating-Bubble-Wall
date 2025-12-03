export interface BubbleMessage {
  id: string;
  name: string;
  program: string;
  text: string;
  color: string;
  icon: string;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

export interface MessagePayload {
  name: string;
  program: string;
  text: string;
  color: string;
  icon: string;
}

export const COLORS = [
  { name: 'Orange', class: 'bg-orange-500' },
  { name: 'Deep Orange', class: 'bg-orange-600' },
  { name: 'Amber', class: 'bg-amber-500' },
  { name: 'Coral', class: 'bg-orange-400' },
  { name: 'Peach', class: 'bg-orange-300' },
  { name: 'Burnt Orange', class: 'bg-orange-700' },
  { name: 'Light Orange', class: 'bg-orange-200' },
  { name: 'Tangerine', class: 'bg-orange-500' },
];

export const ICONS = [
  'Heart',
  'Baby',
  'Home',
  'Users',
  'Shield',
  'HandHeart',
  'Flower2',
  'Sparkles',
  'Smile',
  'HeartHandshake',
];

export const MAX_BUBBLES = 20;
export const BUBBLE_SIZE = 180;
export const MAX_MESSAGE_LENGTH = 100;
export const MAX_NAME_LENGTH = 30;
export const MAX_PROGRAM_LENGTH = 20;
export const SEND_COOLDOWN_MS = 2000;
