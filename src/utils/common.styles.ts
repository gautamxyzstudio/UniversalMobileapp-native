import {Platform} from 'react-native';
import {moderateScale} from './metrics';

export const fontFamily = {
  regular: 'Helvetica-Regular',
  bold: 'Helvetica-Bold',
};

export const fonts = {
  medium: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(16),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(20),
      },
    }),
  },
  mediumBold: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(16),
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(24),
  },
  regular: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(14),
  },
  regularBold: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(14),
  },
  headingSmall: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(20),
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(12),
  },
  smallBold: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(12),
  },
  extraSmall: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(10),
  },
};