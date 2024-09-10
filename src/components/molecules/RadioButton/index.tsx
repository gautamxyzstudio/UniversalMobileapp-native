import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useEffect} from 'react';
import {Pressable} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import * as TapHaptic from '@utils/haptic';
import {Theme, useThemeAwareObject} from '@theme/index';
import {useTheme} from '@theme/Theme.context';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';

type IRadioButtonProps = {
  currentValue: boolean;
  text: string;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto' | undefined;
  radioButtonClickHandler?: any;
  radioBorderColor?: string;
  radioBackgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const RadioButton: React.FC<IRadioButtonProps> = ({
  text,
  pointerEvents,
  currentValue,
  radioButtonClickHandler,
  containerStyle,
  radioBackgroundColor,
  radioBorderColor,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const radioAnimationInitialValue = useSharedValue(currentValue ? 1 : 0);
  const {theme} = useTheme();
  const radioBg = radioBackgroundColor ?? 'transparent';
  const outerAnimatedStyles = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        radioAnimationInitialValue.value,
        [0, 1],
        [theme.color.grey, theme.color.darkBlue],
      ),
    };
  });

  const innerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: radioAnimationInitialValue.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (currentValue) {
      radioAnimationInitialValue.value = withTiming(1);
      TapHaptic.tapHaptic();
    } else {
      radioAnimationInitialValue.value = withTiming(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  return (
    <Pressable onPress={radioButtonClickHandler} pointerEvents={pointerEvents}>
      <View style={[styles.container, containerStyle]}>
        <Animated.View
          style={[
            styles.outer,
            outerAnimatedStyles,
            {borderColor: radioBorderColor ?? theme.color.grey},
          ]}>
          <Animated.View
            style={[
              styles.inner,
              {backgroundColor: radioBg},
              innerAnimatedStyles,
            ]}>
            <View style={styles.innerDot} />
          </Animated.View>
        </Animated.View>
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Pressable>
  );
};

export default RadioButton;

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 48,
      alignItems: 'center',
      gap: 12,
    },
    outer: {
      width: verticalScale(16),
      height: verticalScale(16),
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.color.darkBlue,
      borderRadius: verticalScale(8),
    },
    inner: {
      flex: 1,
      backgroundColor: theme.color.darkBlue,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerDot: {
      height: verticalScale(8.5),
      width: verticalScale(8.5),
      backgroundColor: theme.color.darkBlue,
      borderRadius: verticalScale(4.25),
    },
    text: {
      color: theme.color.textPrimary,
      ...fonts.regular,
    },
  });
  return styles;
};
