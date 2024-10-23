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
  useLazyCheckEmailVerificationStatusQuery,
  useSendEmailOtpMutation,
} from '@api/features/user/userApi';
import {useDispatch} from 'react-redux';
import {setLoading} from '@api/features/loading/loadingSlice';
import {ISignUp, ISignUpParams} from './types';
import {useToast} from 'react-native-toast-notifications';

const SignUp: React.FC<ISignUpParams> = ({route}) => {
  const userType = route.params.user_type;
  const navigation = useNavigation<NavigationProps>();
  const [sendOptVerificationRequest] = useSendEmailOtpMutation();
  const toast = useToast();
  const [checkEmailStatus] = useLazyCheckEmailVerificationStatusQuery();
  const reduxDispatch = useDispatch();

  const [state, dispatch] = useReducer(
    (prev: ISignUp, next: ISignUp) => ({
      ...prev,
      ...next,
    }),
    {
      email: '',
      password: '',
      confirmPassword: '',
      isCheckedPrivacyPolicy: false,
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
    },
  );

  const checkEmailStatusAndUserDetails = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      const emailStatusResponse = await checkEmailStatus({email}).unwrap();
      if (emailStatusResponse.verified) {
        reduxDispatch(setLoading(false));
        toast.show('An account already exists with this email', {
          type: 'error',
        });
      } else {
        const otpSent = await sendOtp(email);
        if (otpSent) {
          reduxDispatch(setLoading(false));
          toast.show('OTP sent successfully', {type: 'success'});
          navigation.navigate('otpVerification', {
            email,
            password,
            confirmPassword,
            userType,
          });
        } else {
          toast.show('Failed to send OTP', {type: 'error'});
          reduxDispatch(setLoading(false));
        }
      }
    } catch (error) {
      reduxDispatch(setLoading(false));
      toast.show(STRINGS.someting_went_wrong, {type: 'error'});
    }
  };

  const sendOtp = async (email: string): Promise<boolean> => {
    try {
      const result = await sendOptVerificationRequest({email}).unwrap();
      return result?.message ? true : false;
    } catch (error) {
      return false;
    }
  };

  const onPressSignup = async () => {
    try {
      const fields = await signupSchema.validate(state, {abortEarly: false});
      reduxDispatch(setLoading(true));
      checkEmailStatusAndUserDetails(
        fields.email,
        fields.password,
        fields.confirmPassword,
      );
    } catch (error) {
      const validationErrors = error as ValidationError;
      const errors: {[key: string]: string} = {};
      validationErrors.inner.forEach(err => {
        if (err.path) errors[err.path] = err.message;
      });

      dispatch({
        emailError: errors.email,
        passwordError: errors.password,
        confirmPasswordError: errors.confirmPassword,
      });

      if (errors.isCheckedPrivacyPolicy) {
        toast.show(`${errors.isCheckedPrivacyPolicy}`, {type: 'error'});
      }
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
          onTextChange={email => dispatch({email, emailError: ''})}
          value={state.email}
          keyboardType="email-address"
          autoCapitalize="none"
          title={STRINGS.email}
          errorMessage={state.emailError}
        />
        <View style={styles.spacer} />
        <PasswordTextInput
          onChangeText={password => dispatch({password, passwordError: ''})}
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
          onChangeText={confirmPassword =>
            dispatch({confirmPassword, confirmPasswordError: ''})
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
          onTextPress={() => Alert.alert('Privacy Policy')}
          focusedText={STRINGS.privacy_Policy}
          checkBoxClickHandler={() =>
            dispatch({isCheckedPrivacyPolicy: !state.isCheckedPrivacyPolicy})
          }
        />
        <View style={styles.bottomView}>
          <CustomButton
            disabled={!state.isCheckedPrivacyPolicy}
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
  spacer: {height: 16},
  top: {marginTop: 12},
  bottomView: {marginVertical: 38},
  bottom: {marginTop: 16, alignSelf: 'center'},
});
