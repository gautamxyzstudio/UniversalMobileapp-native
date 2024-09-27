import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  clientTabBarProps,
  clientTabBarRoutes,
  employeeTabBarRoutes,
} from './types';
import ClientHome from '@screens/clientScreens/clientHome';
import CandidateList from '@screens/clientScreens/candidateList';
import ClientSchedule from '@screens/clientScreens/clientSchedule';
import ClientProfile from '@screens/clientScreens/clientProfile';

const ClientTabNavigator = () => {
  const ClientTab = createBottomTabNavigator();

  return (
    <ClientTab.Navigator
      screenOptions={({route}) => clientTabBarProps({route})}>
      <ClientTab.Screen name={clientTabBarRoutes.home} component={ClientHome} />
      <ClientTab.Screen
        name={clientTabBarRoutes.contactList}
        component={CandidateList as any}
      />
      <ClientTab.Screen
        name={clientTabBarRoutes.schedule}
        component={ClientSchedule}
      />
      <ClientTab.Screen
        name={employeeTabBarRoutes.profile}
        component={ClientProfile}
      />
    </ClientTab.Navigator>
  );
};

export default ClientTabNavigator;
