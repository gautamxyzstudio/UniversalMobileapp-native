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
import {employeeTabBarRoutes} from '../types';
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
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;
  const styles = useThemeAwareObject(createStyles);

  const translateAnimation = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(TAB_WIDTH * state.index)}],
    };
  });

  const scaleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{scale: withTiming(scaleAnimationValue.value)}],
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
        <Animated.View
          style={[
            styles.slidingTabContainer,
            {width: TAB_WIDTH},
            translateAnimation,
          ]}>
          <View style={styles.slidingTab} />
        </Animated.View>
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
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate(route.name, {merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1}}>
              <View style={styles.contentContainer}>
                {isFocused ? (
                  <Animated.View
                    style={[styles.contentContainer, scaleAnimation]}>
                    <EmployeeTabBarIcon
                      route={route.name}
                      isFocused={isFocused}
                    />
                    <Text
                      style={[
                        styles.text,
                        {
                          marginLeft:
                            route.name === employeeTabBarRoutes.schedules
                              ? verticalScale(6)
                              : verticalScale(12),
                        },
                      ]}>
                      {capitalizeFirstLetter(route.name)}
                    </Text>
                  </Animated.View>
                ) : (
                  <EmployeeTabBarIcon
                    route={route.name}
                    isFocused={isFocused}
                  />
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
    slidingTab: {
      width: verticalScale(102),
      height: verticalScale(48),
      borderRadius: verticalScale(40),
      backgroundColor: color.darkBlue,
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
