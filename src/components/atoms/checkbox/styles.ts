import {Theme} from '@theme/index';
import {fontFamily} from '@utils/common.styles';
import {moderateScale, verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tick: {
      width: verticalScale(12),
      height: verticalScale(9),
      resizeMode: 'contain',
    },
    description: {
      color: theme.color.textPrimary,
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(12),
    },
    checkboxOuter: {
      height: verticalScale(22),
      width: verticalScale(22),
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxInner: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 6,
      backgroundColor: theme.color.darkBlue,
    },
    view: {
      width: 10,
    },
  });
  return styles;
};
