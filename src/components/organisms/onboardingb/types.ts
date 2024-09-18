import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';

export interface IOnboardingProps {
  children: React.ReactNode;
  hideBack?: boolean;
  title?: string;
  subTitle?: string;
  displayRightIcon?: boolean;
  isInlineTitle?: boolean;
  isProfile?: boolean;
  rightIconPressHandler?: () => void;
  rightIcon?: React.FC<SvgProps>;
  childrenStyles?: StyleProp<ViewStyle>;
}
