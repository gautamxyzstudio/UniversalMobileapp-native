import {Theme} from '@theme/index';
import {fontFamily, fonts} from '@utils/common.styles';
import {verticalScale, moderateScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    title: {
      paddingHorizontal: verticalScale(8),
      backgroundColor: theme.color.primary,
      position: 'absolute',
      left: verticalScale(16),
      top: verticalScale(-8),
      ...fonts.small,
      color: theme.color.disabled,
    },
    container: {
      borderWidth: 1,
      paddingVertical: verticalScale(24),
      marginTop: 6,
      borderColor: theme.color.grey,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    loadingView: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: verticalScale(80),
      height: verticalScale(80),
      borderRadius: verticalScale(40),
      zIndex: 1,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.color.red,
      fontFamily: fontFamily.regular,
      marginTop: verticalScale(2),
    },
    documentUploadedContainer: {
      borderRadius: 4,
      backgroundColor: theme.color.ternary,
      width: verticalScale(310),
      paddingHorizontal: verticalScale(12),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: verticalScale(56),
    },
    description: {
      marginLeft: verticalScale(12),
    },
    leftView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightView: {direction: 'rtl', flexDirection: 'row'},
    replaceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: verticalScale(24),
    },
    replaceText: {
      marginRight: verticalScale(2),
      color: theme.color.disabled,
    },
    docName: {
      width: verticalScale(130),
      ...fonts.small,
      color: theme.color.textPrimary,
    },
    size: {
      marginTop: verticalScale(2),
      ...fonts.extraSmall,
      color: theme.color.disabled,
    },
    assetsView: {
      gap: verticalScale(12),
      width: '100%',
      paddingHorizontal: verticalScale(16),
    },
  });
  return styles;
};
