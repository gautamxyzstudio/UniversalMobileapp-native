import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.color.darkBlue,
      borderRadius: 40,
      height: verticalScale(48),
      paddingHorizontal: verticalScale(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    next: {
      ...fonts.medium,
      color: colors.color.primary,
    },
  });
  return styles;
};
