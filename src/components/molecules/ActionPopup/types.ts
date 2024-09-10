import {Theme} from '@theme/Theme.type';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export const getPopupButtonStylesFromType = (
  type: 'delete' | 'error' | 'success',
  theme: Theme,
): {
  containerStyles: StyleProp<ViewStyle>;
  titleStyles: StyleProp<TextStyle>;
} => {
  switch (type) {
    case 'delete':
      return {
        containerStyles: {
          backgroundColor: theme.color.red,
          borderColor: theme.color.red,
        },
        titleStyles: {
          color: theme.color.primary,
        },
      };
    case 'error':
      return {
        containerStyles: {
          backgroundColor: theme.color.primary,
          borderColor: theme.color.red,
        },
        titleStyles: {
          color: theme.color.red,
        },
      };
    case 'success':
      return {
        containerStyles: {
          backgroundColor: theme.color.primary,
          borderColor: theme.color.blueLight,
        },
        titleStyles: {
          color: theme.color.blueLight,
        },
      };
    default:
      return {
        containerStyles: {
          backgroundColor: theme.color.primary,
          borderColor: theme.color.red,
        },
        titleStyles: {
          color: theme.color.red,
        },
      };
  }
};
