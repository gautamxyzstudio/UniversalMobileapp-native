import {StyleProp, TextStyle} from 'react-native';

export type IRedTextProps = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  isDisabled?: boolean;
};
