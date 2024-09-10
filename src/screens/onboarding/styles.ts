import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale, windowWidth} from '@utils/metrics';
import {StyleSheet} from 'react-native';

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    heading: {
      color: colors.color.darkBlue,
      alignSelf: 'flex-end',
      marginRight: 20,
      marginTop: 30,
      ...fonts.medium,
    },
    container: {
      flex: 1,
    },
    poster: {marginVertical: verticalScale(28)},

    itemContainer: {
      width: windowWidth,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    title: {
      ...fonts.heading,
      color: colors.color.textPrimary,
      textAlign: 'center',
    },
    paragraph: {
      ...fonts.medium,
      marginTop: 24,
      color: colors.color.textPrimary,
      textAlign: 'center',
    },
    buttonContainer: {
      marginBottom: 20,
    },
    listContainer: {
      flex: 3,
    },
  });
  return styles;
};
