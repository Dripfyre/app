/**
 * API Service Layer
 * Handles all backend API calls
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/constants/config';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';

export interface SyncResponse {
  imageUrl: string;
  caption: string;
  hashtag: string;
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

    console.log(`${API_BASE_URL}${API_ENDPOINTS.upload(sessionId)}`);
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.upload(sessionId)}`, {
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
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.sync(sessionId)}`, {
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

    const url = `${API_BASE_URL}${API_ENDPOINTS.edit(sessionId)}`;
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
