export interface ConfigProps {
  /**
   * The text to show in the native dialog when asking for Speech Recognition Permissions
   * @infoPlist `NSSpeechRecognitionUsageDescription` message.
   * @default 'Allow $(PRODUCT_NAME) to securely recognize user speech'
   */
  speechRecognitionPermissionText?: string

  /**
   * The text to show in the native dialog when asking for Microphone Permissions
   * @infoPlist `NSMicrophoneUsageDescription` message.
   * @default 'Allow $(PRODUCT_NAME) to access your microphone'
   */
  microphonePermissionText?: string
}
