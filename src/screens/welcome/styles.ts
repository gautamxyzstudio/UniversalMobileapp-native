import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.color.grey,
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: verticalScale(24),
      alignItems: 'center',
      borderRadius: 8,
    },
    title: {
      ...fonts.regular,
      color: colors.color.textPrimary,
      marginLeft: verticalScale(24),
    },
    secondary: {marginBottom: verticalScale(16)},
    mainView: {flex: 1},
  });
  return styles;
};
