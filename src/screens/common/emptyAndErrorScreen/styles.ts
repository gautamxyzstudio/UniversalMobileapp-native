import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
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

    subHeaderText: {
      marginTop: verticalScale(10),
      textAlign: 'center',
      marginBottom: verticalScale(20),
      color: theme.color.textPrimary,

      ...fonts.mediumBold,
    },

    // empty
    errorHeader: {
      marginTop: verticalScale(20),
      textAlign: 'center',
      paddingHorizontal: verticalScale(20),
      color: theme.color.textPrimary,

      ...fonts.mediumBold,
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
