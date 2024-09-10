import React, {useEffect} from 'react';
import {RootStackParamList, routNames} from './types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '@screens/splash';
import {stackNavigatorConfigurations} from './cofiguration';
import {NavigationContainer} from '@react-navigation/native';
import OnBoarding from '@screens/onboarding';
import Welcome from '@screens/welcome';
import Approval from '@screens/auth/signup/approval';
import JobSeekerDetailsAndDocs from '@screens/auth/signup/jobseekerDetailsAndDocs';
import Login from '@screens/auth/login';
import SplashScreen from 'react-native-splash-screen';
import SelectLocation from '@screens/auth/signup/addLocation/selectLocation';
import addLocationManually from '@screens/auth/signup/addLocation/addLocationManually';
import OtpVerification from '@screens/auth/otp';
import ForgotPassword from '@screens/auth/forgotPassword';
import ConfirmPassword from '@screens/auth/confirmPassword';
import EmployeeTabNavigation from './employeeTabNavigation';
import UpdateEmployeeProfile from '@screens/employeeScreens/updateEmployeeProfile';
import UpdateEmployeeDocument from '@screens/employeeScreens/employeeDocument';
import EmployeeSearch from '@screens/employeeScreens/employeeSearch';
import Notifications from '@screens/notifications';
import JobHistory from '@screens/employeeScreens/employeeJobHistory';
import ProfileSettings from '@screens/common/profileSettings';
import PdfViewer from '@screens/common/pdfViewer';
import updatedDocumentStatus from '@screens/employeeScreens/updatedDocumentStatus';
import ClientTabNavigator from './clientTabNavigator';
import SignUp from '@screens/auth/signup';
import RecruiterDetails from '@screens/auth/signup/recruiterDetails';
import RegisterNewCompany from '@screens/auth/signup/registerNewCompany';
import EmployeeSchedules from '@screens/employeeScreens/employeeSchedules';
import JobDetailsContextProvider from 'src/Providers/JobDetailsContextProvider';
import JobPosting from '@screens/clientScreens/jobPosting';
import EmployeeDocuments from '@screens/employeeScreens/employeeDocument';
import ReviewJobPost from '@screens/clientScreens/reviewJobPost';
import TextEditorView from '@screens/common/textEditorView';
import {PaperProvider} from 'react-native-paper';
import JobPostDrafts from '@screens/clientScreens/jobPostDrafts';

const RootNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <JobDetailsContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={routNames.splash}
          screenOptions={stackNavigatorConfigurations}>
          <Stack.Screen
            name={routNames.profileSettings}
            component={ProfileSettings}
          />
          <Stack.Screen
            name={routNames.employeeJobHistory}
            component={JobHistory}
          />
          <Stack.Screen
            name={routNames.clientTabBar}
            component={ClientTabNavigator}
          />
          <Stack.Screen
            name={routNames.employeeSearch}
            component={EmployeeSearch}
          />
          <Stack.Screen
            name={routNames.notifications}
            component={Notifications}
          />
          <Stack.Screen
            name={routNames.schedule}
            component={EmployeeSchedules}
          />
          <Stack.Screen
            name={routNames.otpVerification}
            component={OtpVerification as React.ComponentType}
          />
          <Stack.Screen name={routNames.splash} component={Splash} />
          <Stack.Screen name={routNames.onBoarding} component={OnBoarding} />
          <Stack.Screen
            name={routNames.welcome}
            component={Welcome as React.ComponentType}
          />
          <Stack.Screen
            name={routNames.signup}
            component={SignUp as React.ComponentType}
          />
          <Stack.Screen
            name={routNames.recruiterDetails}
            component={RecruiterDetails}
          />
          <Stack.Screen name={routNames.login} component={Login} />
          <Stack.Screen name={routNames.approval} component={Approval} />
          <Stack.Screen
            name={routNames.jobSeekerDetailsAndDocs}
            component={JobSeekerDetailsAndDocs}
          />
          <Stack.Screen
            name={routNames.addLocationManually}
            component={addLocationManually}
          />
          <Stack.Screen
            name={routNames.selectLocation}
            component={SelectLocation}
          />
          <Stack.Screen
            name={routNames.forgotPassword}
            component={ForgotPassword}
          />
          <Stack.Screen
            name={routNames.confirmPassword}
            component={ConfirmPassword}
          />
          <Stack.Screen
            name={routNames.employeeTabBar}
            component={EmployeeTabNavigation}
          />
          <Stack.Screen
            options={{presentation: 'fullScreenModal'}}
            name={routNames.updateEmployeeDetails}
            component={UpdateEmployeeProfile}
          />
          <Stack.Screen
            name={routNames.updateEmployeeDocuments}
            component={UpdateEmployeeDocument}
          />
          <Stack.Screen
            name={routNames.employeeDocuments}
            component={EmployeeDocuments}
          />
          <Stack.Screen
            name={routNames.pdfViewer}
            options={{
              animation: 'slide_from_bottom',
            }}
            component={PdfViewer as React.ComponentType<any>}
          />
          <Stack.Screen
            name={routNames.updatedDocumentStatus}
            component={updatedDocumentStatus as React.ComponentType<any>}
          />
          <Stack.Screen
            name={routNames.registerNewCompany}
            options={{
              animation: 'slide_from_bottom',
            }}
            component={RegisterNewCompany}
          />
          <Stack.Screen name={routNames.jobPosting} component={JobPosting} />
          <Stack.Screen
            name={routNames.reviewJobPost}
            component={ReviewJobPost as React.ComponentType<any>}
          />
          <Stack.Screen
            name={routNames.jobPostDrafts}
            component={JobPostDrafts}
          />
          <Stack.Screen
            name={routNames.textEditor}
            options={{
              animation: 'slide_from_bottom',
            }}
            component={TextEditorView as React.ComponentType<any>}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </JobDetailsContextProvider>
  );
};

export default RootNavigator;
