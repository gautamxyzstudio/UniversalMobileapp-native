import React, {useEffect} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {Platform} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@theme/Theme.context';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useDispatch, useSelector} from 'react-redux';
import {
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IClientDetails} from '@api/features/user/types';
import {useLazyGetUserQuery} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {ICONS} from '@assets/exporter';
import {windowWidth} from '@utils/metrics';
import {Row} from '@components/atoms/Row';

const Splash = () => {
  const styles = useThemeAwareObject(getStyles);
  const animationValue = useSharedValue(0);
  const animationValueSec = useSharedValue(0);
  const {theme} = useTheme();
  const backgroundColor = useSharedValue(theme.color.primary);

  const user = useSelector(userBasicDetailsFromState);
  const dispatch = useDispatch();
  const isUserDetails = useSelector(userAdvanceDetailsFromState);
  const navigation = useNavigation<NavigationProps>();
  const [getUserDetails] = useLazyGetUserQuery();

  const fetchUserDetails = async (): Promise<boolean> => {
    try {
      dispatch(setLoading(true));
      const response = await getUserDetails(null).unwrap();
      if (response) {
        let userDetails = response as IClientDetails;
        if (userDetails.status !== 'approved') {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const navigateToNextScreen = async () => {
    setTimeout(
      async () => {
        if (user?.token) {
          if (user.user_type === 'emp') {
            if (isUserDetails) {
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
          } else {
            if (isUserDetails) {
              let client = isUserDetails as IClientDetails;
              if (client.status === 'pending') {
                let isApproved = await fetchUserDetails();
                if (isApproved) {
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
                  routes: [{name: 'clientTabBar'}],
                });
              }
            } else {
              navigation.reset({
                index: 0,
                routes: [{name: 'recruiterDetails'}],
              });
            }
          }
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'onBoarding'}],
          });
        }
      },
      Platform.OS === 'android' ? 100 : 500,
    );
  };

  useEffect(() => {
    animationValue.value = withTiming(1, {
      duration: 500,
      easing: Easing.linear,
    });
    animationValueSec.value = withDelay(
      700,
      withTiming(
        1,
        {
          duration: 500,
          easing: Easing.linear,
        },
        () => {
          runOnJS(navigateToNextScreen)();
        },
      ),
    );
  }, []);

  const backgroundStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  }, []);

  const logoOneStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: interpolate(animationValue.value, [0, 1], [0.7, 1])},
        {
          translateX: interpolate(
            animationValue.value,
            [0, 1],
            [windowWidth * 1.2, 0],
          ),
        },
        {
          rotate: `${interpolate(animationValue.value, [0, 1], [180, 0])}deg`,
        },
      ],
    };
  }, []);

  const logoTwoStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animationValueSec.value,
            [0, 1],
            [windowWidth, 0],
          ),
        },
      ],
    };
  }, []);

  return (
    <Animated.View style={[styles.container, backgroundStyles]}>
      <Row>
        <Animated.Image
          style={[styles.logoOne, logoOneStyles]}
          source={ICONS.logoOne}
        />
        <Animated.Image
          style={[styles.logoTwo, logoTwoStyles]}
          source={ICONS.logoTwo}
        />
      </Row>
    </Animated.View>
  );
};

export default Splash;
