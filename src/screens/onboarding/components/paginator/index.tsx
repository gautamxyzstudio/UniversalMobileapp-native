import {Animated, StyleSheet} from 'react-native';
import React from 'react';
import {verticalScale, windowWidth} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {useTheme} from '@theme/Theme.context';

type IPaginatorProps = {
  data: unknown[];
  scrollX: Animated.Value;
};

const Paginator: React.FC<IPaginatorProps> = ({data, scrollX}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(getStyles);
  return (
    <Row alignCenter center style={styles.container}>
      {data.map((_, index: number) => {
        const inputRange = [
          (index - 1) * windowWidth,
          index * windowWidth,
          (index + 1) * windowWidth,
        ];

        const dowWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.2],
          extrapolate: 'clamp',
        });
        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            theme.color.disabled,
            theme.color.darkBlue,
            theme.color.disabled,
          ],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              styles.dot,
              {
                width: dowWidth,
                opacity: opacity,
                backgroundColor: backgroundColor,
              },
            ]}
            key={index}
          />
        );
      })}
    </Row>
  );
};

export default Paginator;

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    dot: {
      height: verticalScale(10),
      borderRadius: verticalScale(5),
      backgroundColor: theme.color.darkBlue,
    },
    container: {
      gap: verticalScale(12),
    },
  });
  return styles;
};
