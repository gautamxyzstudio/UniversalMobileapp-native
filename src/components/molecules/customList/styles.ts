import {verticalScale} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  footer: {padding: verticalScale(20), alignItems: 'center'},
  activityIndicatorView: {marginTop: verticalScale(15)},
  blankView: {
    ...StyleSheet.absoluteFillObject,
    bottom: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
  },
  separator: {
    height: verticalScale(20),
  },
});
