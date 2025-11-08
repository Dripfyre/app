/**
 * Voice Recording Button Component
 * Handles audio recording with visual feedback
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync
} from 'expo-audio';
import * as Haptics from 'expo-haptics';

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
          colors={isRecording ? ['#FF3B30', '#FF6B30'] : ['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, disabled && styles.buttonDisabled]}
        >
          {isRecording ? (
            <View style={styles.recordingIndicator}>
              <Animated.View style={[styles.pulseCircle, animatedPulseStyle]} />
              <Text style={styles.buttonText}>🎙️ Stop</Text>
            </View>
          ) : (
            <View style={styles.recordingIndicator}>
              <Text style={styles.icon}>🎤</Text>
              <Text style={styles.buttonText}>Speak</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  touchable: {
    borderRadius: 28,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 140,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
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
