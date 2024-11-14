import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backgroundWhite,
    },
    containerList: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
    mainView: {marginTop: verticalScale(24)},

    scrollView: {},
    content: {
      flexGrow: 1,
    },
    marginLeft: {
      marginLeft: verticalScale(10),
      marginVertical: 1,
    },
    spacer: {
      width: verticalScale(24),
    },
    list: {
      marginHorizontal: verticalScale(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      width: verticalScale(24),
    },
    headerSeparator: {
      width: verticalScale(12),
    },
    headingView: {
      // paddingTop: verticalScale(16),
      // paddingBottom: verticalScale(16),
      backgroundColor: color.backgroundWhite,
    },
    footer: {
      height: verticalScale(150),
    },
    filterView: {
      // marginRight: verticalScale(8),
      // gap: verticalScale(8),
    },
    rowView: {
      // gap: verticalScale(8),
    },
    chip: {
      marginRight: verticalScale(8),
    },
  });
  return styles;
};
