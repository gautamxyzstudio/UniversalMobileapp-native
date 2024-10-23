import {Theme} from '@theme/Theme.type';
import {verticalScale, windowHeight, windowWidth} from '@utils/metrics';
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
    loaderView: {
      height: windowHeight / 2,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      position: 'absolute',
    },
    bottomView: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      gap: verticalScale(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomButton: {
      marginVertical: verticalScale(24),
      width: windowWidth - verticalScale(44),
    },
  });
  return styles;
};
