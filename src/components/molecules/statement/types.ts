import {StyleProp, TextStyle} from 'react-native';

export type IStatementProps = {
  containerStyles: StyleProp<TextStyle>;
  withCheckbox?: boolean;
  checkboxCurrentValue?: boolean;
  normalText: string;
  isDisabled?: boolean;
  focusedText: string;
  checkBoxClickHandler?: () => void;
  onTextPress?: () => void;
};
