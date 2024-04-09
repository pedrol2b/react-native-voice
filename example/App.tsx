import { Feather } from '@expo/vector-icons'
import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechVolumeChangeEvent,
  TranscriptionErrorEvent,
  TranscriptionResultsEvent,
  TranscriptionStartEvent,
} from '@pedrol2b/react-native-voice'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function VoiceApp() {
  const [isServiceAvailable, setServiceAvailable] = useState(false)
  const [isMicActive, setMicActive] = useState(false)
  const [value, setValue] = useState('')

  const buttonHitSlop = { top: 4, bottom: 4, left: 0, right: 0 }

  const startRecognition = useCallback(async () => await Voice.start('en-US'), [])
  const cancelRecognition = useCallback(async () => await Voice.cancel(), [])
  const stopRecognition = useCallback(async () => await Voice.stop(), [])

  const clearValueState = () => setValue('')

  /** Ensures the device has some speech recognition engines available */
  const getSpeechServices = async () => {
    try {
      const services = await Voice.getSpeechRecognitionServices()

      const isServicesAvailable = Array.isArray(services) && services.length > 0

      setServiceAvailable(isServicesAvailable)
    } catch (error) {
      setServiceAvailable(false)
      console.error(error)
    }
  }

  const onSpeechStart = (event: SpeechStartEvent) => {
    setMicActive(true)
    console.log('Event onSpeechStart')
  }

  const onSpeechRecognized = (event: SpeechRecognizedEvent) => {
    console.log('Event onSpeechRecognized')
  }

  const onSpeechEnd = (event: SpeechEndEvent) => {
    setMicActive(false)
    console.log('Event onSpeechEnd')
  }

  const onSpeechError = (event: SpeechErrorEvent) => {
    setMicActive(false)
    console.log('Event onSpeechError')
    console.error(event.error)
  }

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const value = event.value?.shift()
    if (!value) return
    setValue(value)
    console.log('Event onSpeechResults')
  }

  const onSpeechPartialResults = (event: SpeechResultsEvent) => {
    console.log('Event onSpeechPartialResults')
  }

  const onSpeechVolumeChanged = (event: SpeechVolumeChangeEvent) => {
    console.log('Event onSpeechVolumeChanged')
  }

  const onTranscriptionStart = (event: TranscriptionStartEvent) => {
    console.log('Event onTranscriptionStart')
  }

  const onTranscriptionEnd = (event: SpeechEndEvent) => {
    console.log('Event onTranscriptionEnd')
  }

  const onTranscriptionError = (event: TranscriptionErrorEvent) => {
    console.log('Event onTranscriptionError')
  }

  const onTranscriptionResults = (event: TranscriptionResultsEvent) => {
    console.log('Event onTranscriptionResults')
  }

  /** Assign the events to the handler function */
  const createListeners = async () => {
    Voice.onSpeechStart = onSpeechStart
    Voice.onSpeechRecognized = onSpeechRecognized
    Voice.onSpeechEnd = onSpeechEnd
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults
    Voice.onSpeechPartialResults = onSpeechPartialResults
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged
    Voice.onTranscriptionStart = onTranscriptionStart
    Voice.onTranscriptionEnd = onTranscriptionEnd
    Voice.onTranscriptionError = onTranscriptionError
    Voice.onTranscriptionResults = onTranscriptionResults
  }

  const removeAllListeners = async () => {
    await Voice.destroy()

    Voice.removeAllListeners()
  }

  useEffect(() => {
    /** Before create the listeners, it ensures the device has some engine available */
    getSpeechServices().then(createListeners)

    /** Clean up the voice listeners if component is unmounted */
    return () => void removeAllListeners()
  }, [])

  return (
    <View style={styles.container}>
      <TextInput multiline value={value} style={styles.textArea} textAlignVertical="top" />
      <View style={styles.buttonContainer}>
        {isMicActive ? (
          <TouchableOpacity hitSlop={buttonHitSlop} disabled={!isServiceAvailable} onPress={stopRecognition}>
            <View style={styles.button}>
              <Feather name="mic-off" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Click to stop</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity hitSlop={buttonHitSlop} disabled={!isServiceAvailable} onPress={startRecognition}>
            <View style={styles.button}>
              <Feather name="mic" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Click to start</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity hitSlop={buttonHitSlop} onPress={clearValueState}>
          <View style={styles.button}>
            <Feather name="trash-2" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Clear text</Text>
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 24,
  },
  textArea: {
    padding: 16,
    minWidth: 280,
    maxWidth: 300,
    height: 140,
    borderRadius: 6,
    borderWidth: 1,
    color: '#94A3B8',
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    gap: 8,
    minWidth: 280,
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 24,
    color: '#FFFFFF',
  },
})
