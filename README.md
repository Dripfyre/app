# DripFyre - Voice-Based Image Editing App

A React Native app built with Expo that allows users to edit images using voice commands.

## Features

- Upload images from gallery or start with a blank canvas
- Voice-based image editing using AI
- Automatic caption and hashtag generation
- Session-based workflow with backend sync
- Download and share edited images

## Architecture

### Pages

1. **Landing Page** ([app/index.tsx](app/index.tsx))
   - Generate session ID
   - Upload from gallery or generate blank canvas
   - Upload image to backend

2. **Edit Page** ([app/edit.tsx](app/edit.tsx))
   - Display synced image
   - Show generated captions and hashtags
   - Voice recording for edit commands
   - Real-time sync with backend

3. **Success Page** ([app/success.tsx](app/success.tsx))
   - Display posted image with caption/hashtag
   - Option to start new editing session

### API Flow

1. Generate `session_id` on landing page
2. Upload image: `POST /upload` with session_id and image
3. Sync data: `GET /{session_id}/sync` to fetch image, caption, hashtag
4. Edit with voice: `POST /{session_id}/edit` with audio (returns 202)
5. Poll sync endpoint to get updated results

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- iOS Simulator or Android Emulator (or physical device)
- Backend API server running

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your backend API URL:
   ```
   EXPO_PUBLIC_API_URL=http://your-backend-url:3000
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

4. Run on your platform:

   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## Project Structure

```
dripFyre-app/
├── app/                        # Pages (Expo Router)
│   ├── index.tsx              # Page 1: Landing/Upload
│   ├── edit.tsx               # Page 2: Voice editing
│   ├── success.tsx            # Page 3: Post confirmation
│   └── _layout.tsx            # Root layout
├── components/                 # Reusable components
│   ├── VoiceButton.tsx        # Voice recording button
│   ├── ImageDisplay.tsx       # Image display with loading
│   └── CaptionBox.tsx         # Caption/hashtag display
├── services/                   # API services
│   └── api.ts                 # Backend API calls
├── utils/                      # Utilities
│   └── session.ts             # Session management
├── constants/                  # Configuration
│   ├── config.ts              # API endpoints & config
│   └── theme.ts               # Theme colors
└── assets/                     # Static assets
    └── images/                # Images
```

## Backend API Requirements

Your backend should implement these endpoints:

### POST /upload
Upload image with session ID
```json
Request: multipart/form-data
- session_id: string
- image: file

Response: 200 OK
{
  "success": true,
  "sessionId": "session_..."
}
```

### GET /{session_id}/sync
Get current session state
```json
Response: 200 OK
{
  "imageUrl": "https://...",
  "caption": "Generated caption text",
  "hashtag": "#tags #here"
}
```

### POST /{session_id}/edit
Process voice edit command
```json
Request: multipart/form-data
- audio: file (m4a/wav)

Response: 202 Accepted
(Processing asynchronously)
```

## Development

### Key Dependencies

- `expo` - React Native framework
- `expo-router` - File-based routing
- `expo-image-picker` - Gallery access
- `expo-av` - Audio recording
- `expo-file-system` - File operations
- `@react-native-async-storage/async-storage` - Local storage

### Configuration

Update API endpoints in [constants/config.ts](constants/config.ts):

```typescript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
```

### Permissions

The app requires these permissions:
- Camera roll access (for image upload)
- Microphone access (for voice recording)

Permissions are requested at runtime when needed.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
