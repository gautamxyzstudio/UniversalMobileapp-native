import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './types';
import * as React from 'react';

export const stackNavigatorConfigurations:
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<RootStackParamList>;
      navigation: any;
    }) => NativeStackNavigationOptions)
  | undefined = {
  headerShown: false,
};

export const navigationRef = React.createRef();
