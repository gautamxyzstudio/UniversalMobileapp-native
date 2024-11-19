import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import CustomTextInput from '@components/atoms/customtextInput';
import CustomButton from '@components/molecules/customButton';
import {verticalScale} from '@utils/metrics';
import {useNavigation} from '@react-navigation/native';
import {forgotPasswordSchema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import {NavigationProps} from 'src/navigator/types';
import {useSendEmailOtpMutation} from '@api/features/user/userApi';
import {useDispatch} from 'react-redux';
import {setLoading} from '@api/features/loading/loadingSlice';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProps>();
  const [email, setEmail] = useState<string>('');
  const dispatch = useDispatch();
  const toast = useToast();
  const [sendOptVerificationRequest] = useSendEmailOtpMutation();
  const [emailError, setEmailError] = useState('');

  const verifyPassword = async () => {
    try {
      const validateEmail = await forgotPasswordSchema.validate(
        {email: email},
        {
          abortEarly: false,
        },
      );
      if (validateEmail) {
        navigateToConfirmPassword(validateEmail.email);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: {[key: string]: string} = {};
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setEmailError(errors.email);
      } else {
        console.error(error);
      }
    }
  };

  const navigateToConfirmPassword = async (email: string) => {
    try {
      dispatch(setLoading(true));
      const otpSent = await sendOtp(email);
      if (otpSent) {
        navigation.navigate('otpVerification', {
          email: email,
          password: '',
          confirmPassword: '',
          userType: 'client',
          isForgotPassword: true,
        });
      }
    } catch (error) {
      showToast(toast, 'unable to send otp', 'error');
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const emailChangeHandler = (e: string) => {
    setEmail(e);
    setEmailError('');
  };

  const sendOtp = async (email: string): Promise<boolean> => {
    try {
      const result = await sendOptVerificationRequest({email}).unwrap();
      return result?.message ? true : false;
    } catch (error) {
      return false;
    }
  };

  return (
    <OnBoardingBackground
      title={STRINGS.forgot_password}
      subTitle={STRINGS.enter_email}>
      <View>
        <CustomTextInput
          onChangeText={e => emailChangeHandler(e)}
          title={STRINGS.email}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          errorMessage={emailError}
        />
        <View style={styles.buttonView}>
          <CustomButton
            disabled={false}
            title={STRINGS.verify}
            onButtonPress={verifyPassword}
          />
        </View>
      </View>
    </OnBoardingBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  buttonView: {
    marginTop: verticalScale(56),
  },
});
