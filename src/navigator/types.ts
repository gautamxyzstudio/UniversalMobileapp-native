import {IUser} from '@api/features/user/types';
import {NavigationProp} from '@react-navigation/native';
import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {Source} from 'react-native-pdf';

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
  schedules: 'schedules',
  profile: 'profile',
};

export const clientTabBarRoutes = {
  home: 'home',
  contactList: 'contactList',
  schedule: 'clientSchedule',
  profile: 'profile',
};
