import {Theme} from '@theme/index';
import {StyleSheet} from 'react-native';

export const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      paddingTop: 0,
    },
  });
  return styles;
};
