import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mainView: {
      borderTopLeftRadius: 56,
      marginTop: verticalScale(24),
      paddingTop: verticalScale(24),
      flex: 1,
      backgroundColor: colors.color.backgroundWhite,
    },
    bottomView: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.color.grey,
      paddingHorizontal: verticalScale(24),
      justifyContent: 'space-between',
      paddingTop: verticalScale(16),
    },
    secondaryButton: {
      width: verticalScale(120),
      backgroundColor: '#fff',
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.color.blueLight,
    },
    buttonPrimary: {
      width: verticalScale(120),
    },
    buttonTitle: {
      color: colors.color.blueLight,
    },
    headerContainer: {
      marginHorizontal: verticalScale(24),
      marginBottom: verticalScale(12),
    },
  });
  return styles;
};
