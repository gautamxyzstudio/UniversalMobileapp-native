/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

import type {StyleProp, ViewProps, ViewStyle} from 'react-native';

type RowProps = {
  alignCenter?: boolean;
  alignStart?: boolean;
  style?: StyleProp<ViewStyle>;
  wrap?: boolean;
  spaceBetween?: boolean;
  center?: boolean;
} & ViewProps;

export const Row: React.FC<RowProps> = ({
  children,
  alignCenter,
  alignStart,
  style,
  wrap,
  spaceBetween,
  center,
  ...props
}) => (
  <View
    style={[
      {flexDirection: 'row'},
      alignCenter && {alignItems: 'center'},
      alignStart && {alignItems: 'flex-start'},
      wrap && {flexWrap: 'wrap'},
      spaceBetween && {justifyContent: 'space-between'},
      center && {justifyContent: 'center'},
      style,
    ]}
    {...props}>
    {children}
  </View>
);
