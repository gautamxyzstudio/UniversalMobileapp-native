import {ColorTheme, Theme} from '@theme/Theme.type';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export type ICustomButtonProps = {
  disabled: boolean;
  onButtonPress?: () => void;
  title?: string;
  backgroundColor?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  type?: 'outline' | 'filled';
  rippleColor?: string;
  loaderColor?: keyof ColorTheme;
  titleStyles?: StyleProp<TextStyle>;
};
