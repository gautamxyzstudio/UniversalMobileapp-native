import {Theme} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginHorizontal: verticalScale(24),
      marginBottom: verticalScale(24),
      // marginVertical: verticalScale(16),
    },
    title: {
      ...fonts.heading,
      lineHeight: verticalScale(28),
      color: theme.color.textPrimary,
    },
    row: {
      marginTop: verticalScale(16),
    },
    titleContainer: {
      marginTop: verticalScale(16),
    },
    subTitle: {
      marginTop: verticalScale(4),
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    mainView: {
      borderTopLeftRadius: 56,
      overflow: 'hidden',
      paddingHorizontal: verticalScale(24),
      paddingTop: verticalScale(24),
      flexGrow: 1,
      backgroundColor: theme.color.primary,
    },
    flexBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    profileContainer: {
      position: 'absolute',
      alignSelf: 'center',
      height: verticalScale(121),
      top: verticalScale(115),
      zIndex: 99,
      alignItems: 'center',
    },
    userName: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    inlineTitleContainer: {
      gap: verticalScale(12),
    },
  });
  return styles;
};
