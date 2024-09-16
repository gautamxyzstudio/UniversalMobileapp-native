/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {ICONS} from '@assets/exporter';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@theme/Theme.context';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IClientDetails} from '@api/features/user/types';
import {useLazyGetUserQuery} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';

const Splash = () => {
  const styles = useThemeAwareObject(getStyles);
  const animationValue = useSharedValue(-100);
  const animationValueX = useSharedValue(0);
  const bottomViewOpacity = useSharedValue(1);
  const scaleValue = useSharedValue(1);
  const opacity = useSharedValue(1);
  const {theme} = useTheme();
  const backgroundColor = useSharedValue(theme.color.blueLight);
  const iconSecOpacity = useSharedValue(0);
  const iconSecScale = useSharedValue(0.2);

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
        if (userDetails.status === 'approved') {
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
  };

  useEffect(() => {
    animationValue.value = withTiming(
      250,
      {
        duration: 1000,
      },
      () => {
        animationValue.value = withTiming(
          0,
          {
            duration: 1000,
          },
          () => {
            animationValue.value = withTiming(250, {
              duration: 300,
            });
            bottomViewOpacity.value = withTiming(0);
            animationValueX.value = withTiming(
              -250,
              {
                duration: 300,
              },
              () => {
                backgroundColor.value = withTiming(
                  '#fff',
                  {
                    duration: 300,
                  },
                  () => {
                    iconSecOpacity.value = withTiming(
                      1,
                      {
                        duration: 1000,
                      },
                      () => {
                        iconSecScale.value = withTiming(
                          1,
                          {
                            duration: 1000,
                          },
                          () => {
                            runOnJS(navigateToNextScreen)();
                          },
                        );
                      },
                    );
                  },
                );
              },
            );
          },
        );
        scaleValue.value = withTiming(0.2, {
          duration: 500,
        });
      },
    );
    opacity.value = withTiming(0, {
      duration: 500,
    });
  }, []);

  const imageStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: animationValueX.value,
        },
        {
          translateY: -animationValue.value,
        },
        {
          scale: scaleValue.value,
        },
      ],
    };
  });

  const opacityStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const bottomViewOpacityStyles = useAnimatedStyle(() => {
    return {
      opacity: bottomViewOpacity.value,
    };
  });

  const iconSecStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: iconSecScale.value,
        },
      ],
      opacity: iconSecOpacity.value,
    };
  });

  const backgroundStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  }, []);

  return (
    <Animated.View style={[styles.container, backgroundStyles]}>
      <Animated.View style={[styles.oval, opacityStyles]} />
      <Animated.Image
        style={[styles.icon, iconSecStyles]}
        source={ICONS.logo}
      />
      <Animated.Image style={[styles.icon, imageStyles]} source={ICONS.globe} />
      <Animated.View style={[styles.popOver, bottomViewOpacityStyles]} />
    </Animated.View>
  );
};

export default Splash;
