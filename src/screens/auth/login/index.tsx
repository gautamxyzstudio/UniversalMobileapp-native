import {Platform, Text, View} from 'react-native';
import React, {useReducer} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import CustomTextInput from '@components/atoms/customtextInput';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {APPLE, GOOGLE} from '@assets/exporter';
import CustomButton from '@components/molecules/customButton';
import Statement from '@components/molecules/statement';
import {googleSignInHandler} from '@utils/googleSignin';
import {appleSignInHandler} from '@utils/appleSignin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {verticalScale} from '@utils/metrics';
import Animated from 'react-native-reanimated';
import {ICollectionFormProperties} from './types';
import {loginSchema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import PasswordTextInput from '@components/molecules/InputTypes/passwordInput';
import {useDispatch} from 'react-redux';
import {
  useLazyGetUserQuery,
  useLoginMutation,
} from '@api/features/user/userApi';
import {ICustomErrorResponse} from '@api/types';
import {setLoading} from '@api/features/loading/loadingSlice';
import {useToast} from 'react-native-toast-notifications';
import {
  saveUserDetails,
  updateClientDetails,
  updateEmployeeDetails,
} from '@api/features/user/userSlice';
import {IClientDetails, IEmployeeDetails} from '@api/features/user/types';
import {IClientStatus} from '@utils/enums';

const Login = () => {
  const styles = useThemeAwareObject(getStyles);

  const [login, {}] = useLoginMutation();
  const [getUserDetails] = useLazyGetUserQuery();
  const toast = useToast();
  const reduxDispatch = useDispatch();
  const [state, dispatch] = useReducer(
    (prev: ICollectionFormProperties, next: ICollectionFormProperties) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      passwordError: '',
      emailError: '',
      passwordVisible: false,
    },
  );
  const navigation = useNavigation<NavigationProps>();
  const signInHandler = async () => {
    try {
      const googleLoginResponse = await googleSignInHandler();
      if (googleLoginResponse.token) {
        console.log(googleLoginResponse.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signUpHandler = () => {
    navigation.navigate('welcome');
  };

  const appleButtonDitTap = async () => {
    try {
      let appleResponse = await appleSignInHandler();
      console.log(appleResponse);
    } catch (error: any) {
      if (error?.code === appleAuth.Error.CANCELED) {
        console.log('signIn canceled');
      } else if (error?.code === appleAuth.Error.UNKNOWN) {
        console.log('signIn canceled');
      } else {
        console.log(error, 'apple auth error');
      }
    }
  };

  const onPressLogin = async () => {
    try {
      reduxDispatch(setLoading(true));
      const fields = await loginSchema.validate(
        {email: state.email, password: state.password},
        {
          abortEarly: false,
        },
      );
      if (fields) {
        try {
          const response = await login({
            identifier: fields.email,
            password: fields.password,
          }).unwrap();
          if (response) {
            reduxDispatch(saveUserDetails(response));
            let userDetails = await getUser();
            if (response.user_type === 'emp') {
              let empDetails = userDetails as IEmployeeDetails;
              if (empDetails.detailsId !== 0) {
                reduxDispatch(updateEmployeeDetails(empDetails));
                navigation.reset({
                  index: 0,
                  routes: [{name: 'employeeTabBar'}],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'jobSeekerDetailsAndDocs'}],
                });
              }
            }
            if (response.user_type === 'client') {
              let clientDetails = userDetails as IClientDetails;
              if (clientDetails.detailsId !== 0) {
                reduxDispatch(updateClientDetails(clientDetails));
                if (clientDetails.status === IClientStatus.ACTIVE) {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'clientTabBar'}],
                  });
                }
                if (clientDetails.status === IClientStatus.PENDING) {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'approval'}],
                  });
                }
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'recruiterDetails'}],
                });
              }
            }
          }
        } catch (err) {
          const error = err as ICustomErrorResponse;
          console.log(',yeyeey', error);
          toast.hideAll();
          toast.show(`${error.message}`, {type: 'error'});
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
      dispatch({
        emailError: errors.email || '',
        passwordError: errors.password || '',
      });
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  const getUser = async (): Promise<
    IEmployeeDetails | null | ICustomErrorResponse | IClientDetails
  > => {
    try {
      const userDetailsResponse = await getUserDetails(null).unwrap();
      if (userDetailsResponse) {
        const details = userDetailsResponse as IEmployeeDetails;
        return details;
      }
      return null;
    } catch (err) {
      let customError = err as ICustomErrorResponse;
      throw customError;
    }
  };

  return (
    <OnBoardingBackground
      hideBack={true}
      title={STRINGS.log_in}
      subTitle={STRINGS.enter_the_mandatory_fields}>
      <Animated.View style={styles.view}>
        <View style={styles.mainView}>
          <CustomTextInput
            onTextChange={e => dispatch({email: e, emailError: ''})}
            value={state.email}
            keyboardType="email-address"
            autoCapitalize="none"
            title={STRINGS.emailOrUsername}
            errorMessage={state.emailError}
          />
          <View style={styles.spacer} />
          <PasswordTextInput
            value={state.password}
            onChangeText={e => dispatch({password: e, passwordError: ''})}
            errorMessage={state.passwordError}
            isPasswordVisible={state.passwordVisible ?? false}
            onPressEye={() =>
              dispatch({passwordVisible: !state.passwordVisible})
            }
            title={STRINGS.password}
          />
          {/* <View style={styles.forgotPassword}>
            <FocusedText
              onPress={() => navigation.navigate('forgotPassword')}
              textStyle={styles.forgotText}
              text={STRINGS.forgot_password}
            />
          </View> */}
          <CustomButton
            title={STRINGS.log_in}
            disabled={false}
            buttonStyle={styles.button}
            onButtonPress={onPressLogin}
          />
          <View style={styles.topView}>
            <Statement
              containerStyles={styles.statementText}
              normalText={'Don’t have an account?'}
              onTextPress={signUpHandler}
              focusedText={'Sign up'}
            />
          </View>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.signText}>{STRINGS.sign_in_with}</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.logins}>
            <GOOGLE
              width={verticalScale(24)}
              height={verticalScale(24)}
              onPress={signInHandler}
            />
            {Platform.OS === 'ios' && (
              <APPLE
                width={verticalScale(24)}
                height={verticalScale(24)}
                onPress={appleButtonDitTap}
                style={[styles.spacerSec]}
              />
            )}
            {/*
          <FACEBOOK
            width={verticalScale(24)}
            height={verticalScale(24)}
            style={[styles.spacerSec]}
          /> */}
          </View>
        </View>
      </Animated.View>
    </OnBoardingBackground>
  );
};

export default Login;

// if (response?.user_type === 'client') {
//   navigation.reset({
//     index: 0,
//     routes: [{name: 'employeeTabBar'}],
//   });
// }
// if (response?.user_type === 'emp') {
//   navigation.reset({
//     index: 0,
//     routes: [{name: 'jobSeekerDetailsAndDocs'}],
//   });
// }
// } else {
// if (response?.user_type === 'client') {
//   navigation.reset({
//     index: 0,
//     routes: [{name: 'approval'}],
//   });
// }
// if (response?.user_type === 'emp') {
//   navigation.reset({
//     index: 0,
//     routes: [{name: 'jobSeekerDetailsAndDocs'}],
//   });
// }
// }
