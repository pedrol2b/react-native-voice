import { NativeEventEmitter, NativeModules, Platform } from 'react-native'
import {
  type SpeechEndEvent,
  type SpeechErrorEvent,
  type SpeechEvents,
  type SpeechRecognizedEvent,
  type SpeechResultsEvent,
  type SpeechStartEvent,
  type SpeechVolumeChangeEvent,
  type TranscriptionEndEvent,
  type TranscriptionErrorEvent,
  type TranscriptionEvents,
  type TranscriptionResultsEvent,
  type TranscriptionStartEvent,
} from './VoiceModuleTypes'
import { assert } from './utils/assert'

const Voice = NativeModules.Voice

// NativeEventEmitter is only available on React Native platforms, so this conditional is used to avoid import conflicts in the browser/server
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const voiceEmitter = Platform.OS !== 'web' ? new NativeEventEmitter(Voice) : null
type SpeechEvent = keyof SpeechEvents
type TranscriptionEvent = keyof TranscriptionEvents

class RCTVoice {
  _loaded: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _listeners: any[] | null
  _events: Required<SpeechEvents> & Required<TranscriptionEvents>

  constructor() {
    this._loaded = false
    this._listeners = null
    this._events = {
      onSpeechStart: () => {},
      onSpeechRecognized: () => {},
      onSpeechEnd: () => {},
      onSpeechError: () => {},
      onSpeechResults: () => {},
      onSpeechPartialResults: () => {},
      onSpeechVolumeChanged: () => {},
      onTranscriptionStart: () => {},
      onTranscriptionEnd: () => {},
      onTranscriptionError: () => {},
      onTranscriptionResults: () => {},
    }
  }

  removeAllListeners() {
    Voice.onSpeechStart = undefined
    Voice.onSpeechRecognized = undefined
    Voice.onSpeechEnd = undefined
    Voice.onSpeechError = undefined
    Voice.onSpeechResults = undefined
    Voice.onSpeechPartialResults = undefined
    Voice.onSpeechVolumeChanged = undefined
    Voice.onTranscriptionStart = undefined
    Voice.onTranscriptionEnd = undefined
    Voice.onTranscriptionError = undefined
    Voice.onTranscriptionResults = undefined
  }

  async destroy() {
    if (!this._loaded && !this._listeners) {
      return await Promise.resolve()
    }
    return await new Promise<void>((resolve, reject) => {
      Voice.destroySpeech((error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          if (this._listeners) {
            this._listeners.map((listener) => listener.remove())
            this._listeners = null
          }
          resolve()
        }
      })
    })
  }

  async destroyTranscription() {
    if (!this._loaded && !this._listeners) {
      return await Promise.resolve()
    }
    return await new Promise<void>((resolve, reject) => {
      Voice.destroyTranscription((error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          if (this._listeners) {
            this._listeners.map((listener) => listener.remove())
            this._listeners = null
          }
          resolve()
        }
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async start(locale: any, options = {}) {
    if (!this._loaded && !this._listeners && voiceEmitter !== null) {
      this._listeners = (Object.keys(this._events) as SpeechEvent[]).map((key: SpeechEvent) =>
        voiceEmitter.addListener(key, this._events[key]),
      )
    }

    return await new Promise<void>((resolve, reject) => {
      const callback = (error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          resolve()
        }
      }
      if (Platform.OS === 'android') {
        Voice.startSpeech(
          locale,
          Object.assign(
            {
              EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
              EXTRA_MAX_RESULTS: 5,
              EXTRA_PARTIAL_RESULTS: true,
              REQUEST_PERMISSIONS_AUTO: true,
            },
            options,
          ),
          callback,
        )
      } else {
        Voice.startSpeech(locale, callback)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async startTranscription(url: any, locale: any, options = {}) {
    if (!this._loaded && !this._listeners && voiceEmitter !== null) {
      this._listeners = (Object.keys(this._events) as TranscriptionEvent[]).map((key: TranscriptionEvent) =>
        voiceEmitter.addListener(key, this._events[key]),
      )
    }

    return await new Promise<void>((resolve, reject) => {
      const callback = (error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          resolve()
        }
      }
      if (Platform.OS === 'android') {
        Voice.startTranscription(
          url,
          locale,
          Object.assign(
            {
              EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
              EXTRA_MAX_RESULTS: 5,
              EXTRA_PARTIAL_RESULTS: true,
              REQUEST_PERMISSIONS_AUTO: true,
            },
            options,
          ),
          callback,
        )
      } else {
        Voice.startTranscription(url, locale, callback)
      }
    })
  }

  async stop() {
    if (!this._loaded && !this._listeners) {
      return await Promise.resolve()
    }
    return await new Promise<void>((resolve, reject) => {
      Voice.stopSpeech((error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          resolve()
        }
      })
    })
  }

  async stopTranscription() {
    if (!this._loaded && !this._listeners) {
      return await Promise.resolve()
    }
    return await new Promise<void>((resolve, reject) => {
      Voice.stopTranscription((error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          resolve()
        }
      })
    })
  }

  async cancel() {
    if (!this._loaded && !this._listeners) {
      return await Promise.resolve()
    }
    return await new Promise<void>((resolve, reject) => {
      Voice.cancelSpeech((error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          resolve()
        }
      })
    })
  }

  async cancelTranscription() {
    if (!this._loaded && !this._listeners) {
      return await Promise.resolve()
    }
    return await new Promise<void>((resolve, reject) => {
      Voice.cancelSpeech((error: Error) => {
        if (error) {
          reject(error ?? new Error(error))
        } else {
          resolve()
        }
      })
    })
  }

  async isAvailable(): Promise<0 | 1> {
    return await new Promise((resolve, reject) => {
      Voice.isSpeechAvailable((isAvailable: 0 | 1, error: string) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(isAvailable)
        }
      })
    })
  }

  /**
   * (Android) Get a list of the speech recognition engines available on the device
   * */
  getSpeechRecognitionServices() {
    if (Platform.OS !== 'android') {
      assert(Voice, 'Speech recognition services can be queried for only on Android')
      return
    }

    return Voice.getSpeechRecognitionServices()
  }

  async isRecognizing(): Promise<0 | 1> {
    return await new Promise((resolve) => {
      Voice.isRecognizing((isRecognizing: 0 | 1) => resolve(isRecognizing))
    })
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechStart(fn: (e: SpeechStartEvent) => void) {
    this._events.onSpeechStart = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onTranscriptionStart(fn: (e: TranscriptionStartEvent) => void) {
    this._events.onTranscriptionStart = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechRecognized(fn: (e: SpeechRecognizedEvent) => void) {
    this._events.onSpeechRecognized = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechEnd(fn: (e: SpeechEndEvent) => void) {
    this._events.onSpeechEnd = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onTranscriptionEnd(fn: (e: SpeechEndEvent) => void) {
    this._events.onTranscriptionEnd = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechError(fn: (e: SpeechErrorEvent) => void) {
    this._events.onSpeechError = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onTranscriptionError(fn: (e: TranscriptionErrorEvent) => void) {
    this._events.onTranscriptionError = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechResults(fn: (e: SpeechResultsEvent) => void) {
    this._events.onSpeechResults = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onTranscriptionResults(fn: (e: TranscriptionResultsEvent) => void) {
    this._events.onTranscriptionResults = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechPartialResults(fn: (e: SpeechResultsEvent) => void) {
    this._events.onSpeechPartialResults = fn
  }

  // eslint-disable-next-line accessor-pairs
  set onSpeechVolumeChanged(fn: (e: SpeechVolumeChangeEvent) => void) {
    this._events.onSpeechVolumeChanged = fn
  }
}

export type {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechEvents,
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechVolumeChangeEvent,
  TranscriptionEndEvent,
  TranscriptionErrorEvent,
  TranscriptionEvents,
  TranscriptionResultsEvent,
  TranscriptionStartEvent,
}

export default new RCTVoice()
