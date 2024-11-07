import {Theme} from '@theme/index';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      paddingTop: 0,
    },
    mainView: {
      flex: 1,
      paddingTop: 12,
    },
    list: {
      paddingLeft: verticalScale(24),
    },
  });
  return styles;
};
