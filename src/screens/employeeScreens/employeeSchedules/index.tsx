import {StyleSheet, View} from 'react-native';
import React from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import HorizontalCalendar from '@components/employee/HorizontalCalendar';
import {verticalScale} from '@utils/metrics';
import ScheduledJobCard from '@components/employee/ScheduledJobCard';
import {scheduledMockJobs} from '@api/mockData';

const EmployeeSchedules = () => {
  return (
    <OnBoardingBackground
      childrenStyles={styles.children}
      hideBack
      title={STRINGS.schedules}>
      <HorizontalCalendar />
      <View style={styles.mainView}>
        <ScheduledJobCard jobDetails={scheduledMockJobs[0]} />
        <ScheduledJobCard jobDetails={scheduledMockJobs[1]} />
      </View>
    </OnBoardingBackground>
  );
};

export default EmployeeSchedules;

const styles = StyleSheet.create({
  children: {
    paddingHorizontal: 0,
  },
  header: {
    marginLeft: 24,
    marginBottom: 16,
  },
  mainView: {
    marginHorizontal: 24,
    marginTop: verticalScale(20),
    gap: verticalScale(12),
  },
});
