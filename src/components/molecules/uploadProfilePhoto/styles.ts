import {Theme} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      width: verticalScale(85),
      alignSelf: 'center',
    },
    main: {
      width: verticalScale(80),
      height: verticalScale(80),
      borderRadius: verticalScale(40),
      backgroundColor: theme.color.lightGrey,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.color.grey,
      alignItems: 'center',
    },
    iconView: {
      width: verticalScale(24),
      height: verticalScale(24),
      borderRadius: 100,
      backgroundColor: '#dee5ff',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      right: 8,
    },
    camera: {
      position: 'absolute',
      padding: 4,
      bottom: 0,
      right: 5,
    },
    uploadText: {
      ...fonts.small,
      flex: 1,
      color: theme.color.darkBlue,
      alignSelf: 'center',
      marginTop: verticalScale(8),
    },
    errorText: {
      ...fonts.small,
      flex: 1,
      color: theme.color.red,
      textAlign: 'center',
      width: '100%',
      alignSelf: 'center',
      marginTop: verticalScale(8),
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
    errorView: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      width: verticalScale(80),
      height: verticalScale(80),
      borderRadius: verticalScale(40),
      zIndex: 3,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderWidth: 1,
      borderColor: 'rgba(255, 0, 0, 0.5)',

      justifyContent: 'center',
      alignItems: 'center',
    },
    retryText: {
      color: theme.color.red,
      ...fonts.medium,
    },
  });
  return styles;
};
