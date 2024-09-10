import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IRedTextProps} from './styles';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {touchSlope} from 'src/constants/constants';
import {useTheme} from '@theme/Theme.context';

const FocusedText: React.FC<IRedTextProps> = ({
  text,
  textStyle,
  onPress,
  isDisabled,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      disabled={isDisabled}
      hitSlop={touchSlope}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          {color: isDisabled ? theme.color.darkBlue : theme.color.red},
          textStyle,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default FocusedText;

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    text: {
      color: theme.color.red,
      ...fonts.regular,
    },
  });
  return styles;
};
