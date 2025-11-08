/**
 * API Configuration
 * Update API_BASE_URL with your backend server URL
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  upload: (sessionId: string) => `/api/v1/${sessionId}/upload`,
  sync: (sessionId: string) => `/api/v1/${sessionId}/sync`,
  edit: (sessionId: string) => `/api/v1/${sessionId}/edit`,
  post: (sessionId: string) => `/api/v1/${sessionId}/post`,
  timeline: '/api/v1/timeline',
} as const;

/**
 * Blank canvas image URL
 * You can replace this with a local image or your own hosted blank canvas
 * For local: require('@/assets/images/blank-canvas.png')
 * For remote: Use a URL to an 800x800px blank white image
 */

//export const BLANK_IMAGE_URL = 'https://placehold.co/800?text=I+Am+Fire+!';
export const BLANK_IMAGE_URL = 'https://w7.pngwing.com/pngs/505/437/png-transparent-superman-logo-superman-logo-batman-superman-logo-comics-heroes-text-thumbnail.png';
