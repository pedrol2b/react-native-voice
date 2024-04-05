import { AndroidConfig, createRunOncePlugin, withInfoPlist, type ConfigPlugin } from '@expo/config-plugins'

interface Package {
  name: string
  version: string
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name: packageName, version: packageVersion } = require('@pedrol2b/react-native-voice/package.json') as Package

const MICROPHONE = 'Allow $(PRODUCT_NAME) to access the microphone'

const SPEECH_RECOGNITION = 'Allow $(PRODUCT_NAME) to securely recognize user speech'

export interface Props {
  /**
   * `NSSpeechRecognitionUsageDescription` message.
   */
  speechRecognitionPermission?: string | false

  /**
   * `NSMicrophoneUsageDescription` message.
   */
  microphonePermission?: string | false
}

/**
 * Adds `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription` to the `Info.plist`.
 *
 * @param props.speechRecognitionPermission speech recognition message
 * @param props.microphonePermission microphone permission message
 * @returns
 */
const withIosPermissions: ConfigPlugin<Props> = (c, { microphonePermission, speechRecognitionPermission } = {}) => {
  return withInfoPlist(c, (config) => {
    if (microphonePermission !== false) {
      config.modResults.NSMicrophoneUsageDescription =
        microphonePermission ?? config.modResults.NSMicrophoneUsageDescription ?? MICROPHONE
    }
    if (speechRecognitionPermission !== false) {
      config.modResults.NSSpeechRecognitionUsageDescription =
        speechRecognitionPermission ?? config.modResults.NSSpeechRecognitionUsageDescription ?? SPEECH_RECOGNITION
    }

    return config
  })
}

/**
 * Adds the following to the `AndroidManifest.xml`: `<uses-permission android:name="android.permission.RECORD_AUDIO" />`
 */
const withAndroidPermissions: ConfigPlugin = (config) => {
  return AndroidConfig.Permissions.withPermissions(config, ['android.permission.RECORD_AUDIO'])
}

const withVoice: ConfigPlugin<Props> = (config, props = {}) => {
  const _props = props ?? {}
  config = withIosPermissions(config, _props)
  if (_props.microphonePermission !== false) {
    config = withAndroidPermissions(config)
  }

  return config
}

export default createRunOncePlugin(withVoice, packageName, packageVersion)
