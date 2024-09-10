import {StyleSheet, View} from 'react-native';
import React, {useReducer} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import CustomTextInput from '@components/atoms/customtextInput';
import {verticalScale} from '@utils/metrics';
import PasswordTextInput from '@components/molecules/InputTypes/passwordInput';
import CustomButton from '@components/molecules/customButton';
import {IConfirmPasswordProps} from './types';
import {confirmPasswordSchema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';

const ConfirmPassword = () => {
  const [state, dispatch] = useReducer(
    (prev: IConfirmPasswordProps, next: IConfirmPasswordProps) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      confirmPasswordVisible: false,
      passwordVisible: false,
    },
  );
  const verifyPassword = async () => {
    try {
      const fields = await confirmPasswordSchema.validate(state, {
        abortEarly: false,
      });
      if (fields) {
        console.log(fields);
      }
    } catch (error) {
      const validationErrors = error as ValidationError;
      const errors: {[key: string]: string} = {};
      validationErrors.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      dispatch({
        passwordError: errors.password || '',
        confirmPasswordError: errors.confirmPassword || '',
      });
    }
  };
  console.log(state.confirmPasswordVisible, 'SS');

  return (
    <OnBoardingBackground
      title={STRINGS.reset_password}
      subTitle={STRINGS.enter_the_password}>
      <CustomTextInput
        editable={false}
        value="sehgalyash9668@gmail.com"
        title={STRINGS.email}
        errorMessage={undefined}
      />
      <View style={styles.header} />
      <PasswordTextInput
        onChangeText={e => dispatch({password: e, passwordError: ''})}
        value={state.password}
        errorMessage={state.passwordError}
        isPasswordVisible={state.passwordVisible ?? false}
        onPressEye={() => dispatch({passwordVisible: !state.passwordVisible})}
        title={STRINGS.password}
      />
      <View style={styles.header} />
      <PasswordTextInput
        onChangeText={e =>
          dispatch({confirmPassword: e, confirmPasswordError: ''})
        }
        value={state.confirmPassword}
        isPasswordVisible={state.confirmPasswordVisible ?? false}
        errorMessage={state.confirmPasswordError}
        onPressEye={() =>
          dispatch({confirmPasswordVisible: !state.confirmPasswordVisible})
        }
        title={STRINGS.confirmPassword}
      />
      <View style={styles.buttonView}>
        <CustomButton
          disabled={false}
          title={STRINGS.verify}
          onButtonPress={verifyPassword}
        />
      </View>
    </OnBoardingBackground>
  );
};

export default ConfirmPassword;

const styles = StyleSheet.create({
  header: {
    height: verticalScale(12),
  },
  buttonView: {
    marginTop: verticalScale(56),
  },
});
