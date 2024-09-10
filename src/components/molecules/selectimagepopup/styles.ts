import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      marginBottom: verticalScale(36),
      gap: verticalScale(16),
    },
    innerView: {
      paddingVertical: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: verticalScale(16),
      backgroundColor: theme.color.ternary,
      borderRadius: 8,
    },
    imgBg: {
      backgroundColor: theme.color.primary,
      padding: verticalScale(8),
      borderRadius: 8,
      marginRight: verticalScale(24),
    },
    uploadText: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
  });
  return styles;
};
