import {Theme} from '@theme/Theme.type';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    splash: {
      width: '100%',
    },
    imageContainer: {
      backgroundColor: theme.color.darkBlue,
      justifyContent: 'center',
      position: 'absolute',
      alignItems: 'center',
    },
  });
  return styles;
};
