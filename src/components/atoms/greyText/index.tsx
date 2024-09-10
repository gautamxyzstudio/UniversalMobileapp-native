import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {ISmallTextProps} from './types';

const SmallText: React.FC<ISmallTextProps> = ({text, textStyle}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <View>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
};

export default SmallText;

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    text: {
      ...fonts.regular,
      color: theme.color.disabled,
    },
  });
  return styles;
};
