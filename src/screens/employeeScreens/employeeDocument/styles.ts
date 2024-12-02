import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      marginTop: verticalScale(12),
      flex: 1,
    },
    header: {
      marginHorizontal: 24,
    },
    docHeadingContainer: {
      paddingLeft: 24,

      borderBottomWidth: 1,
      borderBottomColor: colors.color.strokeLight,
      paddingBottom: verticalScale(12),
    },
    resumeContainer: {
      marginRight: 24,
    },
    heading: {
      ...fonts.medium,
      color: colors.color.textPrimary,
    },
    listView: {
      marginHorizontal: 24,
      gap: verticalScale(24),
      marginTop: verticalScale(24),
    },
    details: {
      gap: verticalScale(4),
    },
    title: {
      color: colors.color.disabled,
      ...fonts.regular,
    },
    value: {
      color: colors.color.textPrimary,
      ...fonts.regular,
    },
    redDot: {
      width: verticalScale(8),
      height: verticalScale(8),
      borderRadius: verticalScale(4),
      backgroundColor: '#C11919',
      position: 'absolute',
      right: verticalScale(2),
      top: verticalScale(2),
    },
  });
  return styles;
};
