import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    unfinished: {
      width: verticalScale(25),
      backgroundColor: '#303c7a',
      height: verticalScale(25),
      borderRadius: verticalScale(15),
      borderWidth: 2,
      borderColor: colors.color.disabled,
    },
  });
  return styles;
};
