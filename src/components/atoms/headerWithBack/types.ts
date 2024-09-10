import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

export interface IHeaderWithBackProps {
  headerTitle?: string;
  isDark?: boolean;
  headerTitleStyles?: StyleProp<TextStyle>;
  renderRightIcon?: boolean;
  headerStyles?: StyleProp<ViewStyle>;
  withCross?: boolean;
  onPressCross?: () => void;
  withArrow?: boolean;
  icon?: React.FC<SvgProps>;
  onPressRightIcon?: () => void;
}
