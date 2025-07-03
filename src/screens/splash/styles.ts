import {Theme} from '@theme/Theme.type';
import {verticalScale, windowHeight, windowWidth} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    logoOne: {
      width: verticalScale(208),
      height: verticalScale(208),
      resizeMode: 'contain',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    logoText: {
      fontSize: verticalScale(48),
      fontWeight: 'bold',
      color: colors.color.textPrimary,
      fontFamily: 'Poppins-Bold',
    },
    logoTextSec: {
      fontSize: verticalScale(36),
      fontWeight: 'bold',
      color: colors.color.darkBlue,
      fontFamily: 'Poppins-Bold',
    },
    logoTextContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoTwo: {
      width: verticalScale(104),
      position: 'absolute',
      height: verticalScale(104),
      top: 120 / 3,
      resizeMode: 'contain',
    },
    logoThree: {
      width: verticalScale(54),
      position: 'absolute',
      height: verticalScale(54),
      top: -verticalScale(12),
      resizeMode: 'contain',
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
