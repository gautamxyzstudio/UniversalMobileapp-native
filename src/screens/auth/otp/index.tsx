import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fontFamily, fonts} from '@utils/common.styles';
import {moderateScale, verticalScale} from '@utils/metrics';
import OtpInput from '@components/molecules/InputTypes/otpInput';
import CustomButton from '@components/molecules/customButton';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useDispatch} from 'react-redux';
import {
  useRegisterMutation,
  useSendEmailOtpMutation,
  useVerifyOtpEmailMutation,
} from '@api/features/user/userApi';
import {useToast} from 'react-native-toast-notifications';
import {setLoading} from '@api/features/loading/loadingSlice';
import {generateUniqueUserName} from '@utils/constants';
import {saveUserDetails} from '@api/features/user/userSlice';
import {ICustomErrorResponse} from '@api/types';
import {IUser} from '@api/features/user/types';

type IOptVerificationPros = {
  route: {
    params: {
      email: string;
      password: string;
      confirmPassword: string;
      userType: 'emp' | 'client';
    };
  };
};

const OtpVerification: React.FC<IOptVerificationPros> = ({route}) => {
  const [sendOptVerificationRequest] = useSendEmailOtpMutation();
  const [verifyOtpRequest] = useVerifyOtpEmailMutation();
  const [register] = useRegisterMutation();
  const userCred = route.params;
  const styles = useThemeAwareObject(createStyles);
  const toast = useToast();
  const dispatch = useDispatch();
  const [opt, setOpt] = useState('');
  const navigation = useNavigation<NavigationProps>();

  const onChangeOtpHandler = (e: string) => {
    if (e.length === 6) {
      Keyboard.dismiss();
    }
    setOpt(e);
  };

  const sendOtp = async () => {
    try {
      dispatch(setLoading(true));
      const result = await sendOptVerificationRequest({
        email: userCred?.email,
      });
      if (result) {
        dispatch(setLoading(false));
        toast.hideAll();
        toast.show('OTP sent successfully', {
          type: 'success',
        });
      }
    } catch (error) {
      dispatch(setLoading(false));
      toast.hideAll();
      toast.show('unable to send otp', {
        type: 'error',
      });
    }
  };

  const verifyOtp = async () => {
    try {
      dispatch(setLoading(true));
      const verityOptResult = await verifyOtpRequest({
        otp: opt,
        email: userCred?.email,
      }).unwrap();
      if (verityOptResult.approved) {
        let userSignUpRes = await userSignUp();
        if (userSignUpRes) {
          dispatch(saveUserDetails(userSignUpRes));
          toast.show('SignUp Successful', {
            type: 'success',
          });
          if (userCred.userType === 'emp') {
            navigation.reset({
              index: 0,
              routes: [{name: 'jobSeekerDetailsAndDocs'}],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'recruiterDetails'}],
            });
          }
        }
      } else {
        toast.show(`${verityOptResult.details[0]}`, {
          type: 'error',
        });
      }
    } catch (error) {
      console.log(error, 'ERROR');
      toast.show('unable to verify otp', {
        type: 'error',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const userSignUp = async (): Promise<IUser<'emp' | 'client'> | null> => {
    try {
      const response = await register({
        username: generateUniqueUserName(userCred.email),
        email: userCred.email,
        password: userCred.password,
        user_type: userCred.userType,
        role: userCred.userType === 'emp' ? 'EmployeeUser' : 'ClientUser',
      }).unwrap();
      if (response) {
        return response;
      }
      return null;
    } catch (err) {
      const error = err as ICustomErrorResponse;
      toast.show(`${error.message}`, {
        type: 'error',
      });
      return null;
    }
  };
  return (
    <OnBoardingBackground
      title={STRINGS.otP}
      subTitle={STRINGS.enter_the_one_time_password_to_continue}>
      <View style={styles.container}>
        <Text style={styles.heading}>{STRINGS.oTP_Verification}</Text>
        <Text style={styles.subHeading}>
          <Text style={styles.text}>
            {STRINGS.we_Will_send_you_a_one_time_password_on_this_Email}
          </Text>
          <Text style={styles.textMain}>{STRINGS.email}</Text>
        </Text>
        <Text style={styles.emailText}>{userCred?.email}</Text>
        <KeyboardAvoidingView behavior="position" style={styles.container}>
          <View style={styles.top}>
            <OtpInput
              value={opt}
              onChangeText={onChangeOtpHandler}
              onPressText={sendOtp}
            />
          </View>
        </KeyboardAvoidingView>
      </View>

      <View style={styles.view}>
        <CustomButton
          title={STRINGS.submit}
          disabled={opt.length === 6 ? false : true}
          onButtonPress={verifyOtp}
        />
      </View>
    </OnBoardingBackground>
  );
};

export default OtpVerification;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    heading: {
      ...fonts.headingSmall,
      alignSelf: 'center',
      color: color.textPrimary,
    },
    top: {
      marginTop: verticalScale(40),
    },
    container: {
      flex: 1,
    },
    subHeading: {
      marginTop: verticalScale(24),
      marginHorizontal: verticalScale(26),
      textAlign: 'center',
    },
    text: {
      color: color.textPrimary,
      ...fonts.medium,
      lineHeight: moderateScale(24),
    },
    textMain: {
      color: color.textPrimary,
      ...fonts.medium,
      fontFamily: fontFamily.bold,
      lineHeight: moderateScale(24),
    },
    emailText: {
      marginTop: verticalScale(8),
      color: color.disabled,
      alignSelf: 'center',
      ...fonts.regular,
    },
    view: {
      marginTop: verticalScale(56),
    },
  });
  return styles;
};
