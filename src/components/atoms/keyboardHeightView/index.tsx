/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {View} from 'react-native';
import {Keyboard} from 'react-native';
import {StyleProp} from 'react-native';
import {ViewStyle} from 'react-native';

type IPropsKeyboardHeight = {
  style?: StyleProp<ViewStyle>;
  margin?: number | null;
};

export const KeyboardHeightView: React.FC<IPropsKeyboardHeight> = props => {
  const [heightKeyboard, setHeightKeyboard] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      keyboard => {
        setHeightKeyboard(
          keyboard.endCoordinates.height + 50 + (props.margin ?? 0),
        );
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setHeightKeyboard(0);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return <View style={[{height: heightKeyboard}]} />;
};
