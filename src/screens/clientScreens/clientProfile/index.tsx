import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useRef} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import EmployeeProfileTab from '@components/employee/EmployeeProfileTab';
import {
  IC_COMPANY_DETAIL,
  IC_DOWNLOAD_SHEET,
  IC_LOG_ACTIVITY,
  LOGOUT,
  LOGOUT_SECONDARY,
  RATE,
  SETTINGS,
} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {Theme, useThemeAwareObject} from '@theme/index';
import EmployeeInfoView from '@components/employee/EmployeeInfoView';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import ActionPopup from '@components/molecules/ActionPopup';
import {customModalRef} from '@components/molecules/customModal/types';
import store from '@api/store';
import {useSelector} from 'react-redux';
import {
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IEmployeeDetails} from '@api/features/user/types';

const EmployeeProfile = () => {
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  const userBasicDetails = useSelector(userBasicDetailsFromState);
  const userAdvDetails = useSelector(
    userAdvanceDetailsFromState,
  ) as IEmployeeDetails;

  const popupRef = useRef<customModalRef>(null);

  const onPressLogoutTab = useCallback(() => {
    setTimeout(() => {
      popupRef?.current?.handleModalState(true);
    }, 350);
  }, []);

  const onPressLogout = () => {
    popupRef.current?.handleModalState(false);
    setTimeout(() => {
      store.dispatch({type: 'RESET'});
      navigation.reset({
        index: 0,
        routes: [{name: 'onBoarding'}],
      });
    }, 350);
  };
  return (
    <OnBoardingBackground
      childrenStyles={styles.children}
      hideBack
      title={STRINGS.profile}>
      <EmployeeInfoView
        name={userAdvDetails?.name ?? ''}
        email={userBasicDetails?.email ?? ''}
        onPressEdit={() => navigation.navigate('updateEmployeeDetails')}
        profilePicture={userAdvDetails?.selfie}
      />
      <ScrollView>
        <View style={styles.container}>
          <EmployeeProfileTab
            Icon={IC_COMPANY_DETAIL}
            title={STRINGS.companyDetail}
            withArrow={true}
            onPressTab={() => navigation.navigate('employeeDocuments')}
          />
          <EmployeeProfileTab
            Icon={IC_LOG_ACTIVITY}
            title={STRINGS.logActivity}
            withArrow={true}
            onPressTab={() => navigation.navigate('employeeJobHistory')}
          />
          <EmployeeProfileTab
            Icon={IC_DOWNLOAD_SHEET}
            title={STRINGS.downloadCheckinSheets}
            withArrow={true}
            onPressTab={() => navigation.navigate('employeeJobHistory')}
          />
          <EmployeeProfileTab
            Icon={SETTINGS}
            title={STRINGS.settings}
            withArrow={true}
            onPressTab={() => navigation.navigate('profileSettings')}
          />
          <EmployeeProfileTab
            Icon={RATE}
            title={STRINGS.rate_us}
            withArrow={true}
            onPressTab={() => console.log('rate_us')}
          />
          <EmployeeProfileTab
            Icon={LOGOUT}
            title={STRINGS.logOut}
            withArrow={false}
            titleStyles={styles.tab}
            onPressTab={onPressLogoutTab}
          />
        </View>
      </ScrollView>
      <ActionPopup
        ref={popupRef}
        title={STRINGS.are_you_sure_you_want_to_logout_this_account}
        buttonTitle={STRINGS.logOut}
        icon={LOGOUT_SECONDARY}
        buttonPressHandler={onPressLogout}
        type={'error'}
      />
    </OnBoardingBackground>
  );
};

export default EmployeeProfile;
const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      gap: verticalScale(12),
      paddingHorizontal: verticalScale(24),
      marginTop: verticalScale(24),
    },
    tab: {
      color: color.red,
    },
    profileContainer: {
      position: 'absolute',
      top: -60,
      height: verticalScale(121),
      backgroundColor: 'red',
      alignItems: 'center',
    },
    children: {paddingHorizontal: 0, backgroundColor: '#FAFAFA'},
  });
  return styles;
};
