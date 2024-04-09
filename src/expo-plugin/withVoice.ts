import { AndroidConfig, createRunOncePlugin, withInfoPlist, type ConfigPlugin } from '@expo/config-plugins'
import { name, version } from '../../package.json'
import { type ConfigProps } from './@types'

const DEFAULTS = {
  NSSpeechRecognitionUsageDescription: 'Allow $(PRODUCT_NAME) to securely recognize user speech',
  NSMicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone',
}

/**
 * A ConfigPlugin that modifies the iOS permissions in the Info.plist file of the Expo config.
 *
 * @param expoConfig - The Expo config object.
 * @param props - An optional object containing the custom permission texts.
 *
 * @returns The modified Expo config object.
 */
const withIosPermissions: ConfigPlugin<ConfigProps> = (
  expoConfig,
  { speechRecognitionPermissionText, microphonePermissionText } = {},
) => {
  return withInfoPlist(expoConfig, (config) => {
    if (speechRecognitionPermissionText !== undefined) {
      config.modResults.NSSpeechRecognitionUsageDescription =
        speechRecognitionPermissionText ??
        config.modResults.NSSpeechRecognitionUsageDescription ??
        DEFAULTS.NSSpeechRecognitionUsageDescription
    }

    if (microphonePermissionText !== undefined) {
      config.modResults.NSMicrophoneUsageDescription =
        microphonePermissionText ??
        config.modResults.NSMicrophoneUsageDescription ??
        DEFAULTS.NSMicrophoneUsageDescription
    }

    return config
  })
}

/**
 * A ConfigPlugin that modifies the Android permissions in the AndroidManifest.xml file.
 *
 * @param expoConfig - The Expo config object.
 *
 * @returns The modified Expo config object with the 'android.permission.RECORD_AUDIO' permission added.
 */
const withAndroidPermissions: ConfigPlugin = (expoConfig) => {
  return AndroidConfig.Permissions.withPermissions(expoConfig, ['android.permission.RECORD_AUDIO'])
}

/**
 * A ConfigPlugin that modifies both the iOS and Android permissions in the Expo config.
 *
 * @param config - The Expo config object.
 * @param props - An optional object containing the custom permission texts.
 *
 * @returns The modified Expo config object with the appropriate permissions added.
 */
const withVoice: ConfigPlugin<ConfigProps> = (config, props = {}) => {
  const _props = props ?? {}

  config = withIosPermissions(config, _props)
  if (_props.microphonePermissionText !== undefined) {
    config = withAndroidPermissions(config)
  }

  return config
}

export default createRunOncePlugin(withVoice, name, version)
