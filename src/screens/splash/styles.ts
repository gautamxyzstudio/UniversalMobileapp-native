import {Theme} from '@theme/Theme.type';
import {windowHeight} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.color.blueLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    oval: {
      width: 100,
      height: 100,
      opacity: 0.5,
      backgroundColor: colors.color.darkBlue,
      borderRadius: 50,
      transform: [{scaleX: 2.5}],
    },
    icon: {
      position: 'absolute',
    },
    popOver: {
      height: windowHeight / 2 - 50,
      backgroundColor: colors.color.blueLight,
      width: '100%',
      position: 'absolute',
      bottom: 0,
    },
  });
  return styles;
};
