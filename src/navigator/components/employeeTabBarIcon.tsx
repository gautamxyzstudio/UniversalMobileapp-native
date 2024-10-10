import {ImageSourcePropType, StyleSheet, View} from 'react-native';
import React from 'react';
import {employeeTabBarRoutes} from '../types';
import {ICONS} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import Animated from 'react-native-reanimated';

const EmployeeTabBarIcon = ({
  route,
  isFocused,
}: {
  route: string;
  isFocused: boolean;
}) => {
  const renderIcon = (): ImageSourcePropType => {
    switch (route) {
      case employeeTabBarRoutes.home:
        return isFocused ? ICONS.homeFilled : ICONS.home;
      case employeeTabBarRoutes.jobs:
        return isFocused ? ICONS.jobsFilled : ICONS.jobs;
      case employeeTabBarRoutes.schedule:
        return isFocused ? ICONS.schedulesFilled : ICONS.schedules;
      case employeeTabBarRoutes.profile:
        return isFocused ? ICONS.profileFilled : ICONS.profile;
      default:
        return isFocused ? ICONS.homeFilled : ICONS.home;
    }
  };

  return (
    <View>
      <Animated.Image style={styles.icon} source={renderIcon()} />
    </View>
  );
};

export default EmployeeTabBarIcon;

const styles = StyleSheet.create({
  icon: {
    width: verticalScale(24),
    height: verticalScale(24),
  },
});
