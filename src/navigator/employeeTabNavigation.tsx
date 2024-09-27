/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmployeeHome from '@screens/employeeScreens/employeeHome';
import {employeeTabBarProps, employeeTabBarRoutes} from './types';
import EmployeeJobs from '@screens/employeeScreens/employeeJobs';
import EmployeeProfile from '@screens/employeeScreens/employeeProfile';
import EmployeeSchedules from '@screens/employeeScreens/employeeSchedules';

const EmployeeTabNavigation = () => {
  const EmployeeTab = createBottomTabNavigator();

  return (
    <EmployeeTab.Navigator
      screenOptions={({route}) => employeeTabBarProps({route})}>
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.home}
        component={EmployeeHome}
      />
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.jobs}
        component={EmployeeJobs}
      />
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.schedule}
        component={EmployeeSchedules}
      />
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.profile}
        component={EmployeeProfile}
      />
    </EmployeeTab.Navigator>
  );
};

export default EmployeeTabNavigation;
