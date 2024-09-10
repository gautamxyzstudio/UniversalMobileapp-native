import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import Ripple from 'react-native-material-ripple';
type IRippleButtonProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  rippleColor?: string;
  rippleDuration?: number;
  disabled?: boolean;
  rippleOpacity?: number;
  shouldPlayAnimation?: boolean;
  rippleRadius?: number;
  rippleActionHandler: ((event: GestureResponderEvent) => void) | undefined;
};

const RippleButton: React.FC<IRippleButtonProps> = props => {
  const initialValue = useRef(new Animated.Value(1)).current;
  const {shouldPlayAnimation = true} = props;
  const playAnimation = () => {
    if (shouldPlayAnimation) {
      Animated.sequence([
        Animated.timing(initialValue, {
          toValue: 0.97,
          duration: 30,
          useNativeDriver: true,
        }),
        Animated.timing(initialValue, {
          toValue: 1,
          duration: 30,
          useNativeDriver: true,
        }),
      ]).start();
      if (props.rippleActionHandler) {
        props.rippleActionHandler;
      }
    }
  };
  return (
    <Ripple
      onPressIn={playAnimation}
      disabled={props.disabled}
      onPress={props.rippleActionHandler}
      rippleContainerBorderRadius={props.rippleRadius}
      rippleColor={props.rippleColor}
      rippleDuration={props.rippleDuration}
      rippleOpacity={props.rippleOpacity}
      style={[props.style, {transform: [{scale: initialValue}]}]}>
      {props.children}
    </Ripple>
  );
};
export default RippleButton;
