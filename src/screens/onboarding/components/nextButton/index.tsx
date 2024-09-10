/* eslint-disable react-hooks/exhaustive-deps */
import {Animated, Pressable, View} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';
import {verticalScale} from '@utils/metrics';
import {RIGHT_ARROW} from '@assets/exporter';
import Svg, {Circle, G} from 'react-native-svg';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {INextButtonProps} from './types';
import {useTheme} from '@theme/Theme.context';
import * as TapHaptic from '@utils/haptic';

const NextButton: React.FC<INextButtonProps> = ({index, onPress}) => {
  const styles = useThemeAwareObject(getStyles);
  const size = verticalScale(82);
  const center = size / 2;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef<any>(null);
  const {theme} = useTheme();
  const strokeWidth = 3;
  const radius = Math.round(size / 2 - strokeWidth / 2 - 1.3);
  const circumference = Math.round(2 * Math.PI * radius);
  const buttonSize = verticalScale(56);
  const displayPercentage = Math.floor((index / 3) * 100);

  const AnimatedPress = Animated.createAnimatedComponent(Pressable);

  const buttonOnPressHandler = () => {
    onPress();
    TapHaptic.tapHaptic();
  };

  const animation = (toValue: any) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(displayPercentage);
  }, [index]);

  useEffect(() => {
    progressAnimation.addListener(value => {
      const strokeDashoffset = Math.round(
        circumference - (circumference * value.value) / 100,
      );
      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
    return () => {
      progressAnimation.removeAllListeners();
    };
  }, [index]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation={'-90'} origin={center}>
          <Circle
            stroke={'#E6E7E8'}
            ref={progressRef}
            cx={center}
            cy={center}
            r={radius}
            fill={'transparent'}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={theme.color.green}
            ref={progressRef}
            cx={center}
            cy={center}
            fill={'transparent'}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
          />
        </G>
      </Svg>
      <AnimatedPress
        onPress={buttonOnPressHandler}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
        ]}>
        <RIGHT_ARROW />
      </AnimatedPress>
    </View>
  );
};

export default memo(NextButton);
