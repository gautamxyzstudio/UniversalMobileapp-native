import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  icon: {
    width: verticalScale(24),
    height: verticalScale(24),
  },
  container: {
    height: verticalScale(48),
    gap: verticalScale(12),
    backgroundColor: '#FF7312',
    borderRadius: 40,
    paddingHorizontal: verticalScale(12),
    // paddingVertical: verticalScale(8),
  },
  text: {
    color: '#fff',
    ...fonts.smallBold,
  },
});
