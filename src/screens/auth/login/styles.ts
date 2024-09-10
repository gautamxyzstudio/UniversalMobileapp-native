import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale, moderateScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    spacer: {
      height: verticalScale(16),
    },
    forgotPassword: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    forgotText: {
      textAlign: 'right',
      marginTop: verticalScale(13),
    },
    button: {
      marginTop: verticalScale(56),
    },
    divider: {
      width: verticalScale(120),
      height: 1,
      backgroundColor: theme.color.grey,
    },
    topView: {
      marginTop: verticalScale(16),
    },
    dividerContainer: {
      marginTop: verticalScale(56),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    signText: {
      ...fonts.regular,
      color: theme.color.disabled,
      lineHeight: moderateScale(14),
      marginHorizontal: 8,
    },
    statementText: {alignSelf: 'center'},
    logins: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: verticalScale(24),
      alignItems: 'flex-end',
    },
    spacerSec: {
      marginLeft: verticalScale(16),
    },
    mainView: {
      flex: 1,
    },
    bottomView: {marginTop: 24, marginBottom: 34},
    cautionText: {
      ...fonts.small,
      color: theme.color.disabled,
    },
    view: {
      flex: 1,
    },
  });
  return styles;
};
