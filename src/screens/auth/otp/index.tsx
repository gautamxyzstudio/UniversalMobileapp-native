/* eslint-disable react-hooks/exhaustive-deps */
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
  useSendEmailOtpMutation,
  useVerifyOtpEmailMutation,
} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {IUser} from '@api/features/user/types';
import {saveUserDetails} from '@api/features/user/userSlice';
import {useToast} from 'react-native-toast-notifications';

type IOptVerificationPros = {
  route: {
    params: {
      user: IUser<'client' | 'emp'>;
    };
  };
};

const OtpVerification: React.FC<IOptVerificationPros> = ({route}) => {
  const user = route.params?.user;

  console.log(user, 'USER BASIC');

  const [sendOptVerificationRequest] = useSendEmailOtpMutation();
  const [verifyOtpRequest] = useVerifyOtpEmailMutation();
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

  useEffect(() => {
    if (user?.email) {
      sendOtp();
    }
  }, []);

  const sendOtp = async () => {
    if (user?.email) {
      try {
        dispatch(setLoading(true));
        const result = await sendOptVerificationRequest({
          email: user?.email,
        });
        toast.hideAll();
        toast.show('OTP sent successfully', {
          type: 'success',
        });
        if (result) {
          dispatch(setLoading(false));
        }
      } catch (error) {
        dispatch(setLoading(false));
        toast.hideAll();
        toast.show('unable to send otp', {
          type: 'error',
        });
      }
    }
  };

  const verifyOtp = async () => {
    if (user?.email) {
      try {
        dispatch(setLoading(true));
        const verityOptResult = await verifyOtpRequest({
          otp: opt,
          email: user?.email,
        }).unwrap();
        dispatch(setLoading(false));
        if (verityOptResult.approved) {
          dispatch(saveUserDetails(user));
          if (user.user_type === 'emp') {
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
        } else {
          toast.show(`${verityOptResult.details[0]}`, {
            type: 'error',
          });
        }
      } catch (error) {
        console.log(error, 'ERROR');
        dispatch(setLoading(false));
        toast.show('unable to verify otp', {
          type: 'error',
        });
      }
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
        <Text style={styles.emailText}>{user?.email}</Text>
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
