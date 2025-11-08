/**
 * API Service Layer
 * Handles all backend API calls
 */

import { API_ENDPOINTS, getApiBaseUrl } from '@/constants/config';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';

export interface SyncResponse {
  data: {
    images: Array<{ base64: string }>;
    caption: string;
    hashtags: string;
  };
}

export interface UploadResponse {
  success: boolean;
  sessionId: string;
}

/**
 * Upload image to backend
 */
export async function uploadImage(sessionId: string, imageUri: string): Promise<UploadResponse> {
  try {
    console.log("Making upload call", new Date().toISOString());
    const formData = new FormData();

    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('files', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    formData.append('session_id', sessionId);
    
    console.log("passing this to upload api!!");

    const apiBaseUrl = getApiBaseUrl();
    console.log(`${apiBaseUrl}${API_ENDPOINTS.upload(sessionId)}`);
    const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.upload(sessionId)}`, {
      method: 'POST',
      body: formData,
      // DO NOT set Content-Type header - let fetch set it automatically with boundary
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} : ${response.body}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Sync to get current image, caption, and hashtag
 */
export async function syncSession(sessionId: string): Promise<SyncResponse> {
  try {
    console.log("Making sync call", new Date().toISOString());
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.sync(sessionId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

/**
 * Send voice recording for editing
 * Returns 202 Accepted
 */
export async function editWithVoice(sessionId: string, audioUri: string): Promise<void> {
  try {
    console.log("Making edit call", new Date().toISOString());
    console.log("Audio URI:", audioUri);

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}${API_ENDPOINTS.edit(sessionId)}`;
    console.log("Sending edit request to:", url);

    // Use uploadAsync for reliable file uploads in React Native
    const response = await uploadAsync(url, audioUri, {
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'audio',
    });

    console.log("Edit response status:", response.status);

    // if (response.status !== 202) {
    //   console.error("Edit failed with status:", response.status, "Body:", response.body);
    //   throw new Error(`Edit failed: ${response.status} - ${response.body}`);
    // }

    console.log("Edit request accepted (202)");
    // 202 Accepted - processing in background
  } catch (error) {
    console.error('Edit error:', error);
    throw error;
  }
}

/**
 * Post session with user name
 */
export async function postSession(sessionId: string, name: string): Promise<void> {
  try {
    console.log("Making post call", new Date().toISOString());
    console.log("Name:", name);
    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}${API_ENDPOINTS.post(sessionId)}`;
    console.log("Sending post request to:", url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    console.log("Post response status:", response.status);

    if (!response.ok) {
      throw new Error(`Post failed: ${response.status}`);
    }

    console.log("Post successful");
  } catch (error) {
    console.error('Post error:', error);
    throw error;
  }
}

export interface TimelinePost {
  sessionId: string;
  name: string;
  timestamp: number;
  createdAt: string;
  images: Array<{
    url: string;
    base64: string;
    mimeType: string;
  }>;
  caption: string;
  hashtags: string;
}

export interface TimelinePagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TimelineResponse {
  success: boolean;
  data: {
    posts: TimelinePost[];
    pagination: TimelinePagination;
  };
}

/**
 * Fetch timeline posts with pagination
 */
export async function fetchTimeline(page: number = 1, limit: number = 10): Promise<TimelineResponse> {
  try {
    console.log("Fetching timeline", new Date().toISOString());
    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}${API_ENDPOINTS.timeline}?page=${page}&limit=${limit}`;
    console.log("Fetching timeline from:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Timeline response status:", response.status);

    if (!response.ok) {
      throw new Error(`Timeline fetch failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Timeline fetched successfully");
    return data;
  } catch (error) {
    console.error('Timeline fetch error:', error);
    throw error;
  }
}
