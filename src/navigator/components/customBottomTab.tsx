/* eslint-disable react-native/no-inline-styles */
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EmployeeTabBarIcon from './employeeTabBarIcon';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fontFamily, fonts} from '@utils/common.styles';
import {capitalizeFirstLetter} from '@utils/utils.common';
import {verticalScale} from '@utils/metrics';

const CustomBottomTab = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const MARGIN = verticalScale(16);
  const TAB_BAR_WIDTH = width - 2 * MARGIN;
  const scaleAnimationValue = useSharedValue(1);
  const styles = useThemeAwareObject(createStyles);

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{scaleX: withTiming(scaleAnimationValue.value)}],

      backgroundColor: interpolateColor(
        scaleAnimationValue.value,
        [0, 1],
        ['#fff', '#182452'],
      ),
    };
  });

  return (
    <View
      style={[
        styles.tabBarContainer,
        {paddingBottom: insets.bottom, bottom: 0},
      ]}>
      <View
        style={[
          {
            width: TAB_BAR_WIDTH,
          },
          styles.tabBarOuter,
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, {merge: true});
            }
          };

          return (
            <Pressable
              key={index}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={{flex: 1}}>
              <View style={styles.contentContainer}>
                {isFocused ? (
                  <Animated.View
                    style={[
                      {
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: verticalScale(48),
                        borderRadius: 40,
                        paddingHorizontal: verticalScale(16),
                        backgroundColor: '#182452',
                      },
                    ]}>
                    <EmployeeTabBarIcon
                      route={route.name}
                      isFocused={isFocused}
                    />
                    <Text
                      style={[
                        styles.text,
                        {
                          marginLeft: verticalScale(12),
                        },
                      ]}>
                      {capitalizeFirstLetter(route.name)}
                    </Text>
                  </Animated.View>
                ) : (
                  <View>
                    <EmployeeTabBarIcon
                      route={route.name}
                      isFocused={isFocused}
                    />
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTab;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    tabBarOuter: {
      flexDirection: 'row',
      alignSelf: 'center',

      alignItems: 'center',
      justifyContent: 'space-around',
    },
    tabBarContainer: {
      flexDirection: 'row',
      height: verticalScale(Platform.OS === 'ios' ? 110 : 80),
      position: 'absolute',
      width: '100%',
      alignSelf: 'center',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
      shadowColor: color.shadow,
      shadowOffset: {width: 0, height: 0.4},
      elevation: 10,
      shadowRadius: 2,
      shadowOpacity: 0.5,
    },
    slidingTabContainer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      ...fonts.small,
      marginTop: verticalScale(3),
      fontFamily: fontFamily.bold,
      marginLeft: verticalScale(12),
      color: color.primary,
    },
  });
  return styles;
};
