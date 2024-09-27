import React from 'react';
import {IUser} from '@api/features/user/types';
import {ICONS} from '@assets/exporter';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {verticalScale} from '@utils/metrics';
import {Image, Platform, Text} from 'react-native';
import {Source} from 'react-native-pdf';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from './styles';
import {Row} from '@components/atoms/Row';
//type of params which are required by the screen;
export type RootStackParamList = {
  splash: undefined;
  onBoarding: undefined;
  welcome: undefined;
  recruiterDetails: undefined;
  signup: {
    user_type: 'emp' | 'client';
  };
  jobPostDrafts: undefined;
  approval: undefined;
  jobSeekerDetailsAndDocs: undefined;
  login: undefined;
  selectLocation: undefined;
  addLocationManually: undefined;
  otpVerification: {
    user: IUser<'client' | 'emp'>;
  };
  forgotPassword: undefined;
  confirmPassword: undefined;
  employeeTabBar: undefined;
  updateEmployeeDetails: undefined;
  updateEmployeeDocuments: undefined;
  employeeSearch: undefined;
  jobPosting: {draftId: number | null};
  employeeJobHistory: undefined;
  clientTabBar: undefined;
  employeeDocuments: undefined;
  registerNewCompany: undefined;
  schedule: undefined;
  notifications: undefined;
  shortlistedCandidates: undefined;
  reviewJobPost:
    | {
        postDetails: IJobPostInterface;
      }
    | undefined;
  updatedDocumentStatus: undefined;
  pdfViewer:
    | {
        source: Source | undefined;
      }
    | undefined;
  profileSettings: undefined;
  textEditor: {
    initialValue: string | undefined;
    onGoBack: (data: string) => void;
    title: string;
  };
};

export type NavigationProps = NavigationProp<RootStackParamList>;

//routes type definitions
type IScreenType = {
  splash: 'splash';
  onBoarding: 'onBoarding';
  welcome: 'welcome';
  login: 'login';
  selectLocation: 'selectLocation';
  addLocationManually: 'addLocationManually';
  recruiterDetails: 'recruiterDetails';
  signup: 'signup';
  approval: 'approval';
  jobSeekerDetailsAndDocs: 'jobSeekerDetailsAndDocs';
  otpVerification: 'otpVerification';
  forgotPassword: 'forgotPassword';
  confirmPassword: 'confirmPassword';
  registerNewCompany: 'registerNewCompany';
  pdfViewer: 'pdfViewer';
  employeeTabBar: 'employeeTabBar';
  shortlistedCandidates: 'shortlistedCandidates';
  clientTabBar: 'clientTabBar';
  updateEmployeeDetails: 'updateEmployeeDetails';
  employeeDocuments: 'employeeDocuments';
  updateEmployeeDocuments: 'updateEmployeeDocuments';
  employeeSearch: 'employeeSearch';
  schedule: 'schedule';
  notifications: 'notifications';
  employeeJobHistory: 'employeeJobHistory';
  profileSettings: 'profileSettings';
  updatedDocumentStatus: 'updatedDocumentStatus';
  jobPosting: 'jobPosting';
  reviewJobPost: 'reviewJobPost';
  textEditor: 'textEditor';
  jobPostDrafts: 'jobPostDrafts';
};

//routes name definitions
export const routNames: IScreenType = {
  splash: 'splash',
  onBoarding: 'onBoarding',
  welcome: 'welcome',
  approval: 'approval',
  selectLocation: 'selectLocation',
  shortlistedCandidates: 'shortlistedCandidates',
  addLocationManually: 'addLocationManually',
  login: 'login',
  registerNewCompany: 'registerNewCompany',
  recruiterDetails: 'recruiterDetails',
  employeeDocuments: 'employeeDocuments',
  clientTabBar: 'clientTabBar',
  jobSeekerDetailsAndDocs: 'jobSeekerDetailsAndDocs',
  signup: 'signup',
  otpVerification: 'otpVerification',
  forgotPassword: 'forgotPassword',
  confirmPassword: 'confirmPassword',
  employeeTabBar: 'employeeTabBar',
  schedule: 'schedule',
  updateEmployeeDetails: 'updateEmployeeDetails',
  updateEmployeeDocuments: 'updateEmployeeDocuments',
  employeeSearch: 'employeeSearch',
  notifications: 'notifications',
  employeeJobHistory: 'employeeJobHistory',
  profileSettings: 'profileSettings',
  pdfViewer: 'pdfViewer',
  updatedDocumentStatus: 'updatedDocumentStatus',
  jobPosting: 'jobPosting',
  reviewJobPost: 'reviewJobPost',
  jobPostDrafts: 'jobPostDrafts',
  textEditor: 'textEditor',
};

export const employeeTabBarRoutes = {
  home: 'home',
  jobs: 'jobs',
  schedule: 'schedule',
  profile: 'profile',
};

export const clientTabBarRoutes = {
  home: 'home',
  contactList: 'candidates',
  schedule: 'schedule',
  profile: 'profile',
};

const getTabBarIconClient = (route: string, focused: boolean) => {
  switch (route) {
    case clientTabBarRoutes.home:
      return focused ? ICONS.homeFilled : ICONS.home;
    case clientTabBarRoutes.contactList:
      return focused ? ICONS.contactListFilled : ICONS.contactList;
    case clientTabBarRoutes.schedule:
      return focused ? ICONS.schedulesFilled : ICONS.schedules;
    case clientTabBarRoutes.profile:
      return focused ? ICONS.profileFilled : ICONS.profile;
    default:
      return ICONS.home;
  }
};

const getTabBarIconEmployee = (route: string, focused: boolean) => {
  switch (route) {
    case employeeTabBarRoutes.home:
      return focused ? ICONS.homeFilled : ICONS.home;
    case employeeTabBarRoutes.jobs:
      return focused ? ICONS.jobsFilled : ICONS.jobs;
    case employeeTabBarRoutes.schedule:
      return focused ? ICONS.schedulesFilled : ICONS.schedules;
    case employeeTabBarRoutes.profile:
      return focused ? ICONS.profileFilled : ICONS.profile;
    default:
      return ICONS.home;
  }
};

export const RenderTabBarItem = (
  focused: boolean,
  route: RouteProp<ParamListBase, string>,
  type: 'client' | 'employee',
) => {
  const tabBarIcon =
    type === 'client'
      ? getTabBarIconClient(route.name, focused)
      : getTabBarIconEmployee(route.name, focused);
  if (focused) {
    return (
      <Row alignCenter style={styles.container}>
        <Image style={styles.icon} source={tabBarIcon} />
        <Text style={styles.text}>{route.name}</Text>
      </Row>
    );
  } else {
    return <Image style={styles.icon} source={tabBarIcon} />;
  }
};

export const clientTabBarProps = ({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarIcon: ({focused}: {focused: boolean}) => {
    return RenderTabBarItem(focused, route, 'client');
  },
  tabBarStyle: {
    height: verticalScale(Platform.OS === 'ios' ? 110 : 80),
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingHorizontal: verticalScale(12),
    shadowColor: 'rgba(18, 18, 18, 0.12)',
    shadowOffset: {width: 0, height: 0.4},
    elevation: 10,
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  tabBarShowLabel: false,
  tabBarActiveTintColor: Colors.primaryDark,
  tabBarInactiveTintColor: Colors.textGrey,
});

export const employeeTabBarProps = ({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarIcon: ({focused}: {focused: boolean}) => {
    return RenderTabBarItem(focused, route, 'employee');
  },
  tabBarStyle: {
    height: verticalScale(Platform.OS === 'ios' ? 110 : 80),
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingHorizontal: verticalScale(12),
    shadowColor: 'rgba(18, 18, 18, 0.12)',
    shadowOffset: {width: 0, height: 0.4},
    elevation: 10,
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  tabBarShowLabel: false,
  tabBarActiveTintColor: Colors.primaryDark,
  tabBarInactiveTintColor: Colors.textGrey,
});
