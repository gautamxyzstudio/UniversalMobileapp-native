import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    header: {
      marginTop: verticalScale(32),
      paddingBottom: verticalScale(12),
      paddingHorizontal: verticalScale(24),
      borderBottomWidth: 1,
      borderColor: theme.color.grey,
    },
    modal: {
      marginHorizontal: 0,
    },
    heading: {
      ...fonts.headingSmall,
      color: theme.color.textPrimary,
    },
    mainView: {
      flex: 1,
      marginVertical: verticalScale(24),
      gap: verticalScale(40),
    },
    filterOptionContainer: {
      backgroundColor: theme.color.ternary,
    },
    filterOptionTitleContainer: {
      paddingVertical: verticalScale(15),
      width: verticalScale(158),
      paddingHorizontal: verticalScale(16),
    },
    filterOptionTitle: {
      ...fonts.regular,
      color: theme.color.disabled,
    },
    subtitle: {
      ...fonts.regular,
      color: theme.color.disabled,
    },
    options: {
      flex: 1,
      alignItems: 'flex-start',
      gap: verticalScale(16),
    },
  });
  return styles;
};
