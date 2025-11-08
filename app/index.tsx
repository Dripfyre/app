/**
 * Page 1: Landing/Upload Screen
 * User can upload an image from gallery or generate with a blank template
 */

import { BLANK_IMAGE_URL } from '@/constants/config';
import { uploadImage } from '@/services/api';
import { generateSessionId, saveSessionId } from '@/utils/session';
import { getUserName, saveUserName } from '@/utils/userName';
import { File, Paths } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Import the timeline modal component
import TimelineModal from '@/components/TimelineModal';

export default function LandingScreen() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    // Generate session ID on mount
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    saveSessionId(newSessionId);

    // Load or generate user name
    getUserName().then(setUserName);
  }, []);

  const handleNameChange = (text: string) => {
    setUserName(text);
    saveUserName(text);
  };

  const handleImagePicked = async (imageUri: string, isUpload: boolean) => {
    if (!sessionId) {
      Alert.alert('Error', 'Session not initialized. Please try again.');
      return;
    }

    if (isUpload) {
      setUploadLoading(true);
    } else {
      setGenerateLoading(true);
    }

    try {
      // Upload image to backend
      await uploadImage(sessionId, imageUri);

      // Navigate to edit screen
      router.push({
        pathname: '/edit',
        params: { sessionId },
      });
    } catch (error) {
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      if (isUpload) {
        setUploadLoading(false);
      } else {
        setGenerateLoading(false);
      }
    }
  };

  const handleUploadFromGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleImagePicked(result.assets[0].uri, true);
    }
  };

  const handleGenerate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!sessionId) {
      Alert.alert('Error', 'Session not initialized. Please try again.');
      return;
    }

    try {
      // Download blank image to local file system using new File API
      const fileName = `blank_${Date.now()}.png`;
      const file = new File(Paths.cache, fileName);

      await File.downloadFileAsync(BLANK_IMAGE_URL, file);

      await handleImagePicked(file.uri, false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load blank image. Please try again.');
      console.error('Generate error:', error);
      setGenerateLoading(false);
    }
  };

  const handleOpenTimeline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowTimeline(true);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.background}>
            <View style={styles.content}>
              <Animated.View entering={FadeIn.duration(800)} style={styles.headerContainer}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <View style={styles.brandContainer}>
                  <Text style={styles.brandDrip}>Drip</Text>
                  <Text style={styles.brandFire}>Fire</Text>
                </View>
                <Text style={styles.tagline}>
                  Go Viral. On <Text style={styles.taglineHighlight}>Autopilot.</Text>
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.nameInputContainer}>
                <Text style={styles.nameLabel}>Your Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={userName}
                  onChangeText={handleNameChange}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  maxLength={30}
                />
              </Animated.View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <TouchableOpacity
                style={[styles.button, (uploadLoading || generateLoading) && styles.buttonDisabled]}
                onPress={handleUploadFromGallery}
                disabled={uploadLoading || generateLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#00E0C0', '#FF0080']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {uploadLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                  ) : (
                    <Text style={styles.buttonText}>Upload</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <TouchableOpacity
                style={[styles.button, (uploadLoading || generateLoading) && styles.buttonDisabled]}
                onPress={handleGenerate}
                disabled={uploadLoading || generateLoading}
                activeOpacity={0.8}
              >
                <View style={[styles.buttonGradient, styles.generateButton]}>
                  {generateLoading ? (
                    <ActivityIndicator size="large" color="#000000" />
                  ) : (
                    <Text style={styles.generateButtonText}>Generate</Text>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Timeline indicator - static - pinned to bottom */}
          <View style={styles.timelineIndicator}>
            <TouchableOpacity
              onPress={handleOpenTimeline}
              activeOpacity={0.7}
              style={styles.arrowContainer}
            >
              <Text style={styles.timelineHint}>Timeline</Text>
              <Text style={styles.timelineArrow}>↓</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Timeline Modal */}
      <TimelineModal visible={showTimeline} onClose={() => setShowTimeline(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 4,
  },
  nameInputContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 8,
    marginBottom: 30,
  },
  nameLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  nameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDrip: {
    fontSize: 42,
    fontWeight: '800',
    color: '#00E0C0',
    letterSpacing: -0.5,
  },
  brandFire: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FF0080',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  taglineHighlight: {
    color: '#A0FF00',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  button: {
    flex: 1,
    maxWidth: 170,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    // Intense glow effect for gradient button
    shadowColor: '#00E0C0',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  generateButton: {
    backgroundColor: '#A0FF00',
    borderRadius: 32,
    // Intense glow effect for lime green button
    shadowColor: '#A0FF00',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  generateButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.3,
  },
  timelineIndicator: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: '#000000',
  },
  arrowContainer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 50,
  },
  timelineArrow: {
    fontSize: 64,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '800',
    lineHeight: 64,
  },
  timelineHint: {
    fontSize: 24,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 1.2,
  },
});
