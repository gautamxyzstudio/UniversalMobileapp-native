import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {StyleSheet} from 'react-native';

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    pdf: {
      width: 500,
      height: 500,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginHorizontal: 20,
    },
    mainView: {
      width: '100%',
      position: 'absolute',
      right: 20,
      zIndex: 2,
      paddingHorizontal: 20,
    },
    absolute: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      backgroundColor: theme.color.primary,
    },
    errorText: {
      color: theme.color.red,
      ...fonts.medium,
    },
  });
  return styles;
};
