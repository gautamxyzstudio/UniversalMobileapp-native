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
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(20),
      },
    }),
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(24),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(28),
      },
    }),
  },
  regular: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(14),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(18),
      },
    }),
  },
  regularBold: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(14),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(18),
      },
    }),
  },
  headingSmall: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(20),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(24),
      },
    }),
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(12),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(16),
      },
    }),
  },
  smallBold: {
    fontFamily: fontFamily.bold,
    fontSize: moderateScale(12),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(16),
      },
    }),
  },
  extraSmall: {
    fontFamily: fontFamily.regular,
    fontSize: moderateScale(10),
    ...Platform.select({
      ios: {
        lineHeight: moderateScale(14),
      },
    }),
  },
};
