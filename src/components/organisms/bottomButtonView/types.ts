import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export interface IButtonButtonView {
  disabled: boolean;
  onButtonPress: (() => void) | undefined;
  title?: string;
  backgroundColor?: string;
  rippleColor?: string;
  isLoading?: boolean;
  isMultiple?: boolean;
  isSecondaryDisabled?: boolean;
  secondaryButtonTitles?: string;
  onPressSecondaryButton?: () => void;
  secondaryButtonTitleStyles?: StyleProp<TextStyle>;
  primaryButtonTitleStyles?: StyleProp<ViewStyle>;
  buttonType?: 'outline' | 'filled';
  secondaryButtonStyles?: StyleProp<ViewStyle>;
  primaryButtonStyles?: StyleProp<ViewStyle>;
}
