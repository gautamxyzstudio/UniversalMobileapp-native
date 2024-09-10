import {ICONS} from '@assets/exporter';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  StyleProp,
  Text,
  View,
  ViewStyle,
  Pressable,
} from 'react-native';

import {TextStyle} from 'react-native';
import {getStyles} from './styles';
import {useTheme} from '@theme/Theme.context';
import Spacers from '../Spacers';

interface ICheckBoxProps {
  view?: React.ReactNode | undefined;
  text?: string | undefined;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto' | undefined;
  style?: StyleProp<ViewStyle>;
  spaceBetweenCheckboxAndText?: number | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  currentValue?: boolean;
  textStyles?: StyleProp<TextStyle>;
  checkBoxClickHandler?:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
}

const CheckBox: React.FC<ICheckBoxProps> = ({
  text, // = 'Yes, I have a referral code!',
  view,
  checkBoxClickHandler,
  containerStyle,
  spaceBetweenCheckboxAndText = 10,
  textStyles,
  currentValue,
  pointerEvents,
  style,
}) => {
  const clickAnim = useRef(new Animated.Value(0)).current;
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  useEffect(() => {
    Animated.timing(clickAnim, {
      toValue: currentValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
      // delay: 800,
    }).start();
  }, [clickAnim, currentValue]);

  return (
    <Pressable
      pointerEvents={pointerEvents}
      style={[style]}
      onPress={checkBoxClickHandler}>
      <View style={[styles.container, containerStyle]}>
        <Animated.View
          style={[
            styles.checkboxOuter,
            {
              borderColor: currentValue
                ? theme.color.darkBlue
                : theme.color.grey,
              borderWidth: clickAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}>
          <Animated.View
            style={[
              styles.checkboxInner,
              {
                transform: [
                  {
                    scale: clickAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1.3, 1],
                    }),
                  },
                ],
              },
            ]}
          />
          {currentValue && <Image style={styles.tick} source={ICONS.tick} />}
        </Animated.View>
        <Spacers
          scalable={false}
          type="horizontal"
          size={spaceBetweenCheckboxAndText}
        />
        {view && view}
        {text && <Text style={[styles.description, textStyles]}>{text}</Text>}
      </View>
    </Pressable>
  );
};

export default CheckBox;
