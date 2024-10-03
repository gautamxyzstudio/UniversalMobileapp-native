import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: "red",
      // marginTop: 50,
    },

    headerText: {
      marginTop: verticalScale(20),
      color: theme.color.textPrimary,

      ...fonts.mediumBold,
    },
    errorDescription: {
      ...fonts.medium,

      marginTop: verticalScale(8),
      marginBottom: verticalScale(20),
      textAlign: 'center',
      color: theme.color.textPrimary,
    },

    // empty
    errorHeader: {
      marginTop: verticalScale(24),
      textAlign: 'center',
      paddingHorizontal: verticalScale(20),
      color: theme.color.textPrimary,
      ...fonts.headingSmall,
    },

    errorSubHeader: {
      marginTop: verticalScale(10),
      marginBottom: verticalScale(20),
      paddingHorizontal: verticalScale(20),
      textAlign: 'center',
      color: theme.color.textPrimary,

      ...fonts.mediumBold,
    },
  });
  return styles;
};
