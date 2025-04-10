import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './types';

export const stackNavigatorConfigurations:
  | NativeStackNavigationOptions
  | ((props: {
      route: RouteProp<RootStackParamList>;
      navigation: any;
    }) => NativeStackNavigationOptions)
  | undefined = {
  headerShown: false,
};
