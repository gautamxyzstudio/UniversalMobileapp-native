/* eslint-disable react-hooks/rules-of-hooks */
import {Pressable, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type IPressableProps = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  styles?: StyleProp<ViewStyle>;
};

const AnimatedPressable: React.FC<IPressableProps> = ({
  disabled,
  children,
  onPress,
  styles,
}) => {
  const button = useSharedValue(0);

  const createAnimatedScaleStyle = (
    animatedValue: SharedValue<number>,
  ): StyleProp<ViewStyle> =>
    useAnimatedStyle(() => ({
      transform: [{scale: interpolate(animatedValue.value, [0, 1], [1, 0.98])}],
      opacity: interpolate(animatedValue.value, [0, 1], [1, 0.75]),
    }));

  //   const createAnimatedOpacityStyle = (
  //     animatedValue: SharedValue<number>,
  //   ): StyleProp<ViewStyle> =>
  //     useAnimatedStyle(() => ({
  //       opacity: interpolate(animatedValue.value, [0, 1], [1, 0.75]),
  //     }));

  const scaleStyle = createAnimatedScaleStyle(button);

  const handlePressIn = () => {
    button.value = withSpring(1, {duration: 200, stiffness: 5});
  };

  const handlePressOut = () => {
    button.value = withSpring(0, {duration: 200, stiffness: 5});
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles, scaleStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}>
      {children}
    </AnimatedPressable>
  );
};

export default AnimatedPressable;
