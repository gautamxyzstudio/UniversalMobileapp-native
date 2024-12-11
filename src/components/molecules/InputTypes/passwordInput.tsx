import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {EYE, EYE_CLOSED} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';

type IPasswordTextInputPropTypes = {
  value?: string;
  onChangeText: (e: string) => void;
  errorMessage?: string;
  isPasswordVisible: boolean;
  title: string;
  onPressEye: () => void;
};

const PasswordTextInput: React.FC<IPasswordTextInputPropTypes> = ({
  value,
  onChangeText,
  isPasswordVisible,
  onPressEye,
  title,
  errorMessage,
}) => {
  return (
    <View>
      <CustomTextInput
        onTextChange={onChangeText}
        value={value}
        title={title}
        autoCapitalize="none"
        autoComplete="off"
        showSoftInputOnFocus
        errorMessage={errorMessage}
        right={
          <Pressable onPress={onPressEye} style={styles.rightContainer}>
            {isPasswordVisible ? (
              <EYE
                width={verticalScale(28)}
                height={verticalScale(28)}
                onPress={onPressEye}
              />
            ) : (
              <EYE_CLOSED
                width={verticalScale(28)}
                height={verticalScale(28)}
                onPress={onPressEye}
              />
            )}
            {/* <Image
              tintColor={theme.color.disabled}
              style={styles.eyeContainer}
              width={24}
              height={24}
              source={isPasswordVisible ? ICONS.eyeOpen : ICONS.eyeClosed}
            /> */}
          </Pressable>
        }
        secureTextEntry={!isPasswordVisible}
      />
    </View>
  );
};

export default PasswordTextInput;

const styles = StyleSheet.create({
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: verticalScale(16),
  },
  eyeContainer: {
    marginRight: verticalScale(16),
  },
});
