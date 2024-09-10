/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {clientTabBarRoutes, employeeTabBarRoutes} from './types';
import EmployeeProfile from '@screens/employeeScreens/employeeProfile';
import EmployeeSchedules from '@screens/employeeScreens/employeeSchedules';
import CustomBottomTab from './components/customBottomTab';
import ClientHome from '@screens/clientScreens/clientHome';
import CandidateList from '@screens/clientScreens/candidateList';

const ClientTabNavigator = () => {
  const ClientTab = createBottomTabNavigator();

  return (
    <ClientTab.Navigator
      tabBar={props => <CustomBottomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <ClientTab.Screen name={clientTabBarRoutes.home} component={ClientHome} />
      <ClientTab.Screen
        name={clientTabBarRoutes.contactList}
        component={CandidateList}
      />
      <ClientTab.Screen
        name={employeeTabBarRoutes.schedules}
        component={EmployeeSchedules}
      />
      <ClientTab.Screen
        name={employeeTabBarRoutes.profile}
        component={EmployeeProfile}
      />
    </ClientTab.Navigator>
  );
};

export default ClientTabNavigator;
