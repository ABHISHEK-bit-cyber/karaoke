import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import pitchShift from 'pitch-shift';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Karaoke = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [backgroundTrack, setBackgroundTrack] = useState(null);
  const audioRef = useRef(null);
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);  // New state to track whether music is playing


  useEffect(() => {
    const requestPermissions = async () => {
      const status = await request(PERMISSIONS.ANDROID.MICROPHONE);
      if (status !== RESULTS.GRANTED) {
        console.log('Microphone permission denied');
      }
    };
    requestPermissions();

    const track = new Sound('background_track.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error loading track:', error);
      } else {
        setBackgroundTrack(track);
        track.setVolume(0.5);
        track.play();
        setIsPlaying(true); 
      }
    });

    return () => {
      if (backgroundTrack) {
        backgroundTrack.release();
      }
    };
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save recordings.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startRecording = () => {
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'user-recording.wav'
    });

    AudioRecord.start();
    setIsRecording(true);
    AudioRecord.on('data', (data) => {
      const pitchShiftedData = applyPitchShift(data);
      console.log('Pitch shifted data:', pitchShiftedData);
    });
  };

  const stopRecording = () => {
    AudioRecord.stop().then((audioFile) => {
      setIsRecording(false);
      requestStoragePermission();

      const destPath = `${RNFS.ExternalStorageDirectoryPath}/Download/user-recording.wav`;

      RNFS.copyFile(audioFile, destPath)
        .then(() => {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Recording saved!',
            text2: `File Path: ${destPath}`,
            visibilityTime: 4000,
            autoHide: true,
          });
        })
        .catch((err) => {
          console.error('Error moving file:', err);
        });
    });
  };

  const applyPitchShift = (audioData) => {
    return pitchShift(audioData, 2);
  };

  const toggleBackgroundMusic = () => {
    if (backgroundTrack) {
      if (backgroundTrack.isPlaying()) {
        backgroundTrack.pause();
        setIsPlaying(false); 
      } else {
        backgroundTrack.play();
        setIsPlaying(true); 
      }
    }
  };

  const stopMusic = () => {
    backgroundTrack.stop()
    setIsPlaying(false)
  }

  const toggleRecording = () => {
      isRecording ? stopRecording() : startRecording()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        {isRecording ? 'Status: Recording...' : 'Status: Not Recording'}
      </Text>

      <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
        <Text style={styles.recordButtonText}>
          {`${isRecording ? 'Stop' : 'Start'} Recording`}
        </Text>
        <FontAwesome name={isRecording ? 'microphone-slash' : 'microphone'} color={'#000'} size={20} />
      </TouchableOpacity>

      <View style={styles.musicControls}>
        <TouchableOpacity onPress={toggleBackgroundMusic} style={styles.musicControlButton}>
          <FontAwesome name={isPlaying ? 'pause' : 'play'} size={24} color={'black'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={stopMusic} style={styles.musicControlButton}>
          <FontAwesome name={'stop'} size={24} color={'black'} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Favorites")} style={styles.favoritesButton}>
        <Text style={styles.favoritesButtonText}>Go to favorites screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  recordButton: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65cffc',
    padding: 10,
    borderRadius: 10,
  },
  recordButtonText: {
    fontSize: 18,
    marginEnd: 10,
  },
  musicControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  musicControlButton: {
    marginHorizontal: 10,
  },
  favoritesButton: {
    backgroundColor: '#65cffc',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  favoritesButtonText: {
    fontWeight: '500',
  },
});

export default Karaoke;
