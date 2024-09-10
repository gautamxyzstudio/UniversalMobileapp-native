import type {FC, ReactNode} from 'react';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

import type {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from 'react-native';

import {useReanimatedKeyboardAnimation} from 'react-native-keyboard-controller';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useScreenInsets} from 'src/hooks/useScreenInsets';

type KeyboardFloatingViewProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  translateFrom?: number;
  translateTo?: number;
  isAbsolute?: boolean;
};

//todo: add customization to reuse

export const KeyboardFloatingView: FC<KeyboardFloatingViewProps> = ({
  children,
  style,
  translateFrom = 0,
  translateTo,
  isAbsolute,
}) => {
  const {insetsBottom} = useScreenInsets();
  const {progress, height} = useReanimatedKeyboardAnimation();

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [translateFrom, height.value + (translateTo ?? insetsBottom - 10)],
          ),
        },
      ],
    };
  }, [height, progress, translateFrom, translateTo]);

  return (
    <Animated.View
      style={[translateStyle, isAbsolute && styles.absolute, style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    zIndex: 1000,
    position: 'absolute',
    bottom: 0,
    elevation: 20,
    width: SCREEN_WIDTH,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
});
