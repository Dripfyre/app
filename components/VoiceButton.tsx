/**
 * Voice Recording Button Component
 * Handles audio recording with visual feedback
 */

import { BrandColors } from '@/constants/theme';
import {
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

interface VoiceButtonProps {
  onRecordingComplete: (audioUri: string) => void;
  disabled?: boolean;
}

export default function VoiceButton({ onRecordingComplete, disabled }: VoiceButtonProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const isRecording = recorderState.isRecording;

  // Animation values
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  // Set audio mode on mount to allow recording on iOS
  useEffect(() => {
    const setupAudioMode = async () => {
      if (Platform.OS === 'ios') {
        try {
          await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
          });
        } catch (error) {
          console.error('Failed to set audio mode:', error);
        }
      }
    };
    setupAudioMode();
  }, []);

  useEffect(() => {
    if (isRecording) {
      // Pulsing animation when recording
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
      pulseOpacity.value = 1;
    }
  }, [isRecording]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const startRecording = async () => {
    try {
      // Check current permission status first
      const { status: existingStatus } = await getRecordingPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        // Request permissions if not already granted
        const { status } = await requestRecordingPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Microphone permission is required to use voice commands. Please enable it in your device settings.');
        return;
      }

      // Ensure audio mode is set to allow recording on iOS
      if (Platform.OS === 'ios') {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      }

      // Prepare and start recording
      await recorder.prepareToRecordAsync();
      recorder.record();

      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert(`Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();

      if (recorder.uri) {
        onRecordingComplete(recorder.uri);
      }

      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert('Failed to stop recording');
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Animated.View style={[animatedButtonStyle, styles.buttonContainer]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <LinearGradient
          colors={isRecording ? [BrandColors.fuchsia, '#FF6B30'] : [BrandColors.teal, BrandColors.teal]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, disabled && styles.buttonDisabled]}
        >
          {isRecording ? (
            <View style={styles.recordingIndicator}>
              <Animated.View style={[styles.pulseCircle, animatedPulseStyle]} />
              <Text style={styles.buttonText}>🎙️ Stop</Text>
            </View>
          ) : (
            <View style={styles.recordingIndicator}>
              <Text style={styles.buttonText}>Edit ˋˏ✄┈</Text>
              {/* <Text style={styles.icon}>Edit -ˋˏ✄┈</Text> */}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: BrandColors.teal,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 16,
  },
  touchable: {
    borderRadius: 32,
  },
  button: {
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 32,
    minWidth: 150,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: 0.3,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  pulseCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
