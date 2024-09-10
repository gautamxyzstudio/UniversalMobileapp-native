// import React from 'react';
// import {TextInputProps} from 'react-native-paper';
// import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

import React from 'react';
import {StyleProp, TextInputProps, TextStyle, ViewStyle} from 'react-native';

// export interface ICustomTextInputProps extends TextInputProps {
//   cursorColor?: string;
//   rightIcon?: IconSource;
//   displayRightIcon?: boolean;
//   onPressRightIcon?: () => void;
//   title: string;
//   errorMessage?: string;
//   onTextChange: (text: string) => void;
//   secure?: boolean;
//   value: string | undefined;
//   left?: React.ReactNode;
// }
export interface ICustomTextInputProps extends TextInputProps {
  title: string;
  left?: React.ReactNode;
  hideTitle?: boolean;
  right?: React.ReactNode;
  onTextChange?: (text: string) => void;
  errorMessage: string | undefined;
  outerContainerStyles?: StyleProp<ViewStyle>;
  innerContainerStyles?: StyleProp<ViewStyle>;
  textInputStyles?: StyleProp<TextStyle>;
  isMultiline?: boolean;
}
