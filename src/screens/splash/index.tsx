/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Platform, StatusBar, Text, View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import {useTheme} from '@theme/Theme.context';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateClientDetails,
  updateEmployeeDetails,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IClientDetails, IEmployeeDetails} from '@api/features/user/types';
import {useLazyGetUserQuery} from '@api/features/user/userApi';
import {ICONS} from '@assets/exporter';
import {windowWidth} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {ICustomErrorResponse} from '@api/types';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import CustomButton from '@components/molecules/customButton';
import {STRINGS} from 'src/locales/english';
import {IClientStatus} from '@utils/enums';

const Splash = () => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const backgroundColor = useSharedValue(theme.color.primary);

  const animationValue = useSharedValue(0);
  const animationValueSec = useSharedValue(0);
  const logoThreeYoyo = useSharedValue(0);
  const logoThreeVisible = useSharedValue(0); // controls visibility

  const [showLoader, setShowLoader] = useState(false);
  const user = useSelector(userBasicDetailsFromState);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();
  const [getUserDetails, {error}] = useLazyGetUserQuery();

  const getUser = async (): Promise<
    IEmployeeDetails | null | ICustomErrorResponse | IClientDetails
  > => {
    try {
      setShowLoader(true);
      const userDetailsResponse = await getUserDetails(null).unwrap();
      if (userDetailsResponse) {
        const details = userDetailsResponse as IEmployeeDetails;
        return details;
      }
      return null;
    } catch (err) {
      let customError = err as ICustomErrorResponse;
      throw customError;
    } finally {
      setShowLoader(false);
    }
  };

  const navigateToNextScreen = async () => {
    if (user?.token) {
      try {
        const userDetails = await getUser();

        if (user.user_type === 'emp') {
          if (userDetails) {
            dispatch(updateEmployeeDetails(userDetails as IEmployeeDetails));
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
        if (user.user_type === 'client') {
          let clientDetails = userDetails as IClientDetails;
          if (clientDetails) {
            dispatch(updateClientDetails(clientDetails));
            if (clientDetails.status === IClientStatus.ACTIVE) {
              navigation.reset({
                index: 0,
                routes: [{name: 'clientTabBar'}],
              });
            } else {
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
      } catch (err) {
        console.log(err);
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'onBoarding'}],
      });
    }
  };

  useEffect(() => {
    animationValue.value = withTiming(1, {
      duration: 500,
      easing: Easing.linear,
    });

    animationValueSec.value = withDelay(
      700,
      withTiming(1, {
        duration: 500,
        easing: Easing.linear,
      }),
    );

    logoThreeVisible.value = withDelay(1300, withTiming(1, {duration: 300}));

    logoThreeYoyo.value = withDelay(
      1300,
      withRepeat(
        withTiming(1, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
    const timeout = setTimeout(() => {
      navigateToNextScreen();
    }, 3000);
    return () => clearTimeout(timeout); // cl
  }, []);

  const backgroundStyles = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const logoOneStyles = useAnimatedStyle(() => ({
    transform: [
      {scale: interpolate(animationValue.value, [0, 1], [0.7, 1])},
      {
        translateX: interpolate(
          animationValue.value,
          [0, 1],
          [windowWidth * 1.2, 0],
        ),
      },
      {rotate: `${interpolate(animationValue.value, [0, 1], [180, 0])}deg`},
    ],
  }));

  const logoTwoStyles = useAnimatedStyle(() => ({
    transform: [{scale: interpolate(animationValueSec.value, [0, 1], [0, 1])}],
    opacity: interpolate(animationValueSec.value, [0, 1], [0, 1]),
  }));

  const logoThreeStyles = useAnimatedStyle(() => ({
    opacity: logoThreeVisible.value,
    transform: [
      {
        translateY: interpolate(logoThreeYoyo.value, [0, 1], [-8, 8]),
      },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoThreeVisible.value,
    transform: [
      {
        translateY: interpolate(logoThreeVisible.value, [0, 1], [10, 0]),
      },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.container, backgroundStyles]}>
        <Row alignCenter center>
          <Animated.Image
            style={[styles.logoOne, logoOneStyles]}
            source={ICONS.logoOne}
          />
          <Animated.Image
            style={[styles.logoTwo, logoTwoStyles]}
            source={ICONS.logoTwo}
          />
          <Animated.Image
            style={[styles.logoThree, logoThreeStyles]}
            source={ICONS.logoThree}
          />
        </Row>
        <Animated.View style={[styles.logoTextContainer, textAnimatedStyle]}>
          <Text style={styles.logoText}>Universal</Text>
          <Text style={styles.logoTextSec}>Recruitment Inc.</Text>
        </Animated.View>
      </Animated.View>

      {showLoader && (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'large'} color={theme.color.accent} />
        </View>
      )}

      {!showLoader && error && (
        <View style={styles.bottomView}>
          <CustomText size={textSizeEnum.headingBold} value={'Oops!'} />
          <CustomText size={textSizeEnum.medium} value={error.message ?? 'e'} />
          <CustomButton
            disabled={false}
            onButtonPress={navigateToNextScreen}
            buttonStyle={styles.bottomButton}
            type="outline"
            title={STRINGS.try_again}
          />
        </View>
      )}

      {Platform.OS === 'android' && (
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={'#fff'}
        />
      )}
    </>
  );
};

export default Splash;
