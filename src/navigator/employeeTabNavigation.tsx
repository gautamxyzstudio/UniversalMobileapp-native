/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmployeeHome from '@screens/employeeScreens/employeeHome';
import {employeeTabBarRoutes} from './types';
import EmployeeJobs from '@screens/employeeScreens/employeeJobs';
import EmployeeProfile from '@screens/employeeScreens/employeeProfile';
import EmployeeSchedules from '@screens/employeeScreens/employeeSchedules';
import CustomBottomTab from './components/customBottomTab';

const EmployeeTabNavigation = () => {
  const EmployeeTab = createBottomTabNavigator();

  return (
    <EmployeeTab.Navigator
      tabBar={props => <CustomBottomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.home}
        component={EmployeeHome}
      />
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.jobs}
        component={EmployeeJobs}
      />
      <EmployeeTab.Screen
        name={employeeTabBarRoutes.schedules}
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
