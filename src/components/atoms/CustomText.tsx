import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import React, {useMemo} from 'react';
import {ColorTheme, Theme} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';

export interface ITextPropsAdvance extends ITextPropsBasic {
  marginVertical?: number;

  marginTop?: number;
}

export interface ITextPropsBasic {
  value: string;
  size: textSizeEnum;
  color?: keyof ColorTheme;
  customTextStyles?: StyleProp<TextStyle>;
}

const CustomText: React.FC<ITextPropsAdvance> = ({
  value,
  marginTop,
  customTextStyles,
  color,
  size,
  marginVertical,
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () => getStyles(theme.theme, color ?? 'textPrimary'),
    [theme, color],
  );

  const fontStyleAttributes = useMemo(() => getStylesAttributes(size), [size]);

  return (
    <Text
      style={[
        {
          marginTop,
          marginVertical,
          color: styles.title.color,
          ...fontStyleAttributes,
        },
        customTextStyles,
      ]}>
      {value}
    </Text>
  );
};

export default CustomText;

const getStyles = (theme: Theme, color: keyof ColorTheme) => {
  const colors = theme.color;
  return StyleSheet.create({
    title: {
      color: colors[color],
    },
  });
};

export enum textSizeEnum {
  mediumBold,
  small,
  regular,
  headingBold,
  medium,
}

export const getStylesAttributes = (
  size: textSizeEnum,
): {fontSize: number; fontFamily: string} => {
  switch (size) {
    case textSizeEnum.mediumBold:
      return {...fonts.mediumBold};
    case textSizeEnum.regular:
      return {...fonts.regular};
    case textSizeEnum.small:
      return {...fonts.small};
    case textSizeEnum.medium:
      return {...fonts.medium};
    case textSizeEnum.headingBold:
      return {...fonts.heading};
    default:
      return {...fonts.mediumBold};
  }
};
