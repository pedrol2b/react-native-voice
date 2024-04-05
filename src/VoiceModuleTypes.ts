/* eslint-disable @typescript-eslint/no-explicit-any */
import { type EventSubscription } from 'react-native'

type Callback = (error: string) => void

export type VoiceModule = {
  /**
   * Gets list of SpeechRecognitionServices used.
   * @platform android
   */
  getSpeechRecognitionServices: () => Promise<string[]>
  destroySpeech: (callback: Callback) => void
  destroyTranscription: (callback: Callback) => void
  startSpeech: (locale: any, options?: any) => Promise<void>
  startTranscription: (url: any, locale: any, options?: any) => Promise<void>
  stopSpeech: (callback: Callback) => void
  stopTranscription: (callback: Callback) => void
  cancelSpeech: (callback: Callback) => void
  cancelTranscription: (callback: Callback) => void
  isRecognizing: () => Promise<0 | 1>
  isSpeechAvailable: () => Promise<0 | 1>
} & SpeechEvents &
  TranscriptionEvents &
  EventSubscription

export interface SpeechEvents {
  onSpeechStart?: (e: SpeechStartEvent) => void
  onSpeechRecognized?: (e: SpeechRecognizedEvent) => void
  onSpeechEnd?: (e: SpeechEndEvent) => void
  onSpeechError?: (e: SpeechErrorEvent) => void
  onSpeechResults?: (e: SpeechResultsEvent) => void
  onSpeechPartialResults?: (e: SpeechResultsEvent) => void
  onSpeechVolumeChanged?: (e: SpeechVolumeChangeEvent) => void
}

export interface TranscriptionEvents {
  onTranscriptionStart?: (e: TranscriptionStartEvent) => void
  onTranscriptionEnd?: (e: TranscriptionEndEvent) => void
  onTranscriptionError?: (e: TranscriptionErrorEvent) => void
  onTranscriptionResults?: (e: TranscriptionResultsEvent) => void
}

export interface SpeechStartEvent {
  error?: boolean
}

export interface TranscriptionStartEvent {
  error?: boolean
}

export interface SpeechRecognizedEvent {
  isFinal?: boolean
}

export interface SpeechResultsEvent {
  value?: string[]
}

export interface TranscriptionResultsEvent {
  segments?: string[]
  transcription?: string
  isFinal?: boolean
}

export interface SpeechErrorEvent {
  error?: {
    code?: string
    message?: string
  }
}

export interface TranscriptionErrorEvent {
  error?: {
    code?: string
    message?: string
  }
}

export interface SpeechEndEvent {
  error?: boolean
}

export interface TranscriptionEndEvent {
  error?: boolean
}

export interface SpeechVolumeChangeEvent {
  value?: number
}
