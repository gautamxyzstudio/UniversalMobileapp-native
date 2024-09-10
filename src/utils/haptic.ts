import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

export enum TapHapticFeedbackTypes {
  selection = 'selection',
  impactLight = 'impactLight',
  impactMedium = 'impactMedium',
  impactHeavy = 'impactHeavy',
  rigid = 'rigid',
  soft = 'soft',
  notificationSuccess = 'notificationSuccess',
  notificationWarning = 'notificationWarning',
  notificationError = 'notificationError',
  clockTick = 'clockTick',
  contextClick = 'contextClick',
  keyboardPress = 'keyboardPress',
  keyboardRelease = 'keyboardRelease',
  keyboardTap = 'keyboardTap',
  longPress = 'longPress',
  textHandleMove = 'textHandleMove',
  virtualKey = 'virtualKey',
  virtualKeyRelease = 'virtualKeyRelease',
  effectClick = 'effectClick',
  effectDoubleClick = 'effectDoubleClick',
  effectHeavyClick = 'effectHeavyClick',
  effectTick = 'effectTick',
}

export function tapHaptic(
  type: TapHapticFeedbackTypes = TapHapticFeedbackTypes.impactLight,
) {
  RNReactNativeHapticFeedback.trigger(type, {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
}
