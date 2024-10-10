import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    logoOne: {
      width: verticalScale(108),
      height: verticalScale(108),
      resizeMode: 'contain',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: verticalScale(36),
    },
    logoTwo: {
      position: 'absolute',
      top: verticalScale(19),
      left: verticalScale(89),
      backgroundColor: colors.color.primary,
    },
  });
  return styles;
};
