import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/index';
import {verticalScale, windowWidth} from '@utils/metrics';

type ICardOuterProps = {
  children: React.ReactElement;
};

const CardOuter: React.FC<ICardOuterProps> = ({children}) => {
  const styles = useThemeAwareObject(createStyles);
  return <View style={styles.container}>{children}</View>;
};

export default CardOuter;

const createStyles = () => {
  const styles = StyleSheet.create({
    container: {
      padding: verticalScale(12),
      width: windowWidth - verticalScale(48),
      borderWidth: 1,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderColor: 'rgba(18, 18, 18, 0.16)',
    },
  });
  return styles;
};
