import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import CustomButton from '@components/molecules/customButton';
import {STRINGS} from 'src/locales/english';
import PasswordInput from '@components/molecules/InputTypes/passwordInput';
import {verticalScale} from '@utils/metrics';
import {useResetPasswordMutation} from '@api/features/user/userApi';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useDispatch} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import {AppDispatch} from '@api/store';
import {NavigationProps} from 'src/navigator/types';
import {showToast} from '@components/organisms/customToast';
import {resetPasswordSchema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';

const ResetPassword = ({route}: {route: {params: {email: string}}}) => {
  const [resetPassword] = useResetPasswordMutation();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    passwordError: '',
    confirmPasswordError: '',
    isPasswordVisible: false,
    isConfirmPasswordVisible: false,
  });
  console.log('reset password');
  console.log(route.params.email);

  const resetPasswordHandler = withAsyncErrorHandlingPost(
    async () => {
      try {
        const fields = await resetPasswordSchema.validate(state, {
          abortEarly: false,
        });
        if (fields) {
          const response = await resetPassword({
            email: route.params.email,
            password: state.password,
          }).unwrap();
          if (response?.message) {
            showToast(toast, response?.message, 'success');
            navigation.reset({
              index: 0,
              routes: [{name: 'login'}],
            });
          }
        }
      } catch (error) {
        console.log(error, 'ERROR');
        const validationErrors = error as ValidationError;
        const errors: {[key: string]: string} = {};
        validationErrors.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setState({
          ...state,
          passwordError: errors.password || '',
          confirmPasswordError: errors.confirmPassword || '',
        });
      }
    },
    toast,
    dispatch,
  );
  return (
    <OnBoardingBackground
      title={STRINGS.reset_password}
      subTitle={STRINGS.enter_the_new_password}>
      <View style={styles.container}>
        <PasswordInput
          onChangeText={e =>
            setState({...state, password: e, passwordError: ''})
          }
          title={STRINGS.password}
          value={state.password}
          errorMessage={state.passwordError}
          isPasswordVisible={state.isPasswordVisible}
          onPressEye={() =>
            setState({...state, isPasswordVisible: !state.isPasswordVisible})
          }
        />
        <PasswordInput
          onChangeText={e =>
            setState({...state, confirmPassword: e, confirmPasswordError: ''})
          }
          title={STRINGS.confirmPassword}
          value={state.confirmPassword}
          errorMessage={state.confirmPasswordError}
          isPasswordVisible={state.isConfirmPasswordVisible}
          onPressEye={() =>
            setState({
              ...state,
              isConfirmPasswordVisible: !state.isConfirmPasswordVisible,
            })
          }
        />
      </View>

      <CustomButton
        disabled={false}
        title={STRINGS.reset}
        onButtonPress={resetPasswordHandler}
      />
    </OnBoardingBackground>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(12),
  },
});
