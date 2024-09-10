import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {verticalScale} from '@utils/metrics';

type IPopupInputProps = {
  title: string;
  value: string;
  onPressInput?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  isDisabled?: boolean;
  textInputStyles?: StyleProp<TextStyle>;
  compRef?: React.LegacyRef<TextInput>;
  errorMessage: string;
};

const PopupInput: React.FC<IPopupInputProps> = ({
  title,
  value,
  isDisabled,
  textInputStyles,
  errorMessage,
  right,
  compRef,
  onPressInput,
  left,
}) => {
  const pressHandler = () => {
    onPressInput && onPressInput();
  };

  return (
    <View
      style={[
        styles.container,
        {marginBottom: errorMessage ? verticalScale(10) : 0},
      ]}>
      <Pressable style={styles.input} onPress={pressHandler}>
        <View pointerEvents="none">
          <CustomTextInput
            title={title}
            ref={compRef}
            right={right}
            textInputStyles={textInputStyles}
            editable={!isDisabled}
            left={left}
            value={value}
            keyboardType="email-address"
            errorMessage={errorMessage}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default PopupInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: verticalScale(65),
  },
  input: {
    zIndex: 2,
    position: 'absolute',
    height: verticalScale(65),
    width: '100%',
  },
});
