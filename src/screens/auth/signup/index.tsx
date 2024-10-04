import {Alert, StyleSheet, View} from 'react-native';
import React, {useReducer} from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import Statement from '@components/molecules/statement';
import CustomButton from '@components/molecules/customButton';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import PasswordTextInput from '@components/molecules/InputTypes/passwordInput';
import {signupSchema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import {
  useRegisterMutation,
  useSendEmailOtpMutation,
} from '@api/features/user/userApi';
import {useDispatch} from 'react-redux';

import {ICustomErrorResponse} from '@api/types';
import {setLoading} from '@api/features/loading/loadingSlice';
import {ISignUp, ISignUpParams} from './types';
import {generateUniqueUserName} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {IUser} from '@api/features/user/types';

const SignUp: React.FC<ISignUpParams> = ({route}) => {
  const userType = route.params.user_type;
  const navigation = useNavigation<NavigationProps>();
  const [sendOptVerificationRequest] = useSendEmailOtpMutation();
  const toast = useToast();
  const reduxDispatch = useDispatch();

  const [register] = useRegisterMutation();
  const [state, dispatch] = useReducer(
    (prev: ISignUp, next: ISignUp) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      password: '',
      confirmPassword: '',
    },
  );

  const sendOtp = async (response: IUser<'emp' | 'client'>) => {
    if (response?.email) {
      try {
        reduxDispatch(setLoading(true));
        const result = await sendOptVerificationRequest({
          email: response?.email,
        }).unwrap();
        if (result?.message) {
          toast.hideAll();
          toast.show('OTP sent successfully', {
            type: 'success',
          });
          navigation.navigate('otpVerification', {
            user: response,
          });
        }
      } catch (error) {
        toast.hideAll();
        toast.show('unable to send otp', {
          type: 'error',
        });
      }
    }
  };

  const onPressSignup = async () => {
    try {
      const fields = await signupSchema.validate(state, {
        abortEarly: false,
      });
      if (fields) {
        try {
          reduxDispatch(setLoading(true));
          const response = await register({
            username: generateUniqueUserName(fields.email),
            email: fields.email,
            password: fields.password,
            user_type: userType,
            role: userType === 'emp' ? 'EmployeeUser' : 'ClientUser',
          }).unwrap();
          if (response) {
            sendOtp(response);
          }
        } catch (err) {
          const error = err as ICustomErrorResponse;
          toast.show(`${error.message}`, {
            type: 'error',
          });
        } finally {
          reduxDispatch(setLoading(false));
        }
      }
    } catch (error) {
      const validationErrors = error as ValidationError;
      const errors: {[key: string]: string} = {};
      validationErrors.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      if (errors.isCheckedPrivacyPolicy) {
        toast.show(`${errors.isCheckedPrivacyPolicy}`, {type: 'error'});
      }
      dispatch({
        emailError: errors.email,
        passwordError: errors.password,
        confirmPasswordError: errors.confirmPassword,
      });
    }
  };

  return (
    <OnBoardingBackground
      hideBack={false}
      title={STRINGS.signUp}
      subTitle={STRINGS.enter_the_mandatory_fields}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.spacer} />
        <CustomTextInput
          onTextChange={e => dispatch({email: e, emailError: ''})}
          value={state.email}
          keyboardType="email-address"
          autoCapitalize="none"
          title={STRINGS.email}
          errorMessage={state.emailError}
        />
        <View style={styles.spacer} />
        <PasswordTextInput
          onChangeText={e => dispatch({password: e, passwordError: ''})}
          isPasswordVisible={state.isPasswordVisible ?? false}
          value={state.password}
          errorMessage={state.passwordError}
          title={STRINGS.password}
          onPressEye={() =>
            dispatch({isPasswordVisible: !state.isPasswordVisible})
          }
        />
        <View style={styles.spacer} />
        <PasswordTextInput
          onChangeText={e =>
            dispatch({confirmPassword: e, confirmPasswordError: ''})
          }
          isPasswordVisible={state.isConfirmPasswordVisible ?? false}
          value={state.confirmPassword}
          errorMessage={state.confirmPasswordError}
          title={STRINGS.confirmPassword}
          onPressEye={() =>
            dispatch({
              isConfirmPasswordVisible: !state.isConfirmPasswordVisible,
            })
          }
        />
        <Statement
          containerStyles={styles.top}
          normalText={STRINGS.By_Signing_up_I_agree_to_the}
          withCheckbox={true}
          checkboxCurrentValue={state.isCheckedPrivacyPolicy}
          onTextPress={() => Alert.alert('ehllo')}
          focusedText={STRINGS.privacy_Policy}
          checkBoxClickHandler={() =>
            dispatch({isCheckedPrivacyPolicy: !state.isCheckedPrivacyPolicy})
          }
        />
        <View style={styles.bottomView}>
          <CustomButton
            disabled={false}
            title={STRINGS.signUp}
            onButtonPress={onPressSignup}
          />
          <Statement
            containerStyles={styles.bottom}
            normalText={STRINGS.already_have_an_account}
            withCheckbox={false}
            onTextPress={() => navigation.navigate('login')}
            focusedText={STRINGS.log_in}
          />
        </View>
      </KeyboardAwareScrollView>
    </OnBoardingBackground>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  spacer: {
    height: 16,
  },
  photoContainer: {},
  top: {marginTop: 12},
  bottomView: {
    marginVertical: 38,
  },
  bottom: {
    marginTop: 16,
    alignSelf: 'center',
  },
});
