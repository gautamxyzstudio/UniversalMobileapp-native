/* eslint-disable react-hooks/exhaustive-deps */
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import HorizontalCalendar from '@components/employee/HorizontalCalendar';
import {verticalScale} from '@utils/metrics';
import {IJobPostTypes} from '@api/features/client/types';
import EmptyState from '@screens/common/emptyAndErrorScreen';
import {IC_EMPTY_SCHEDULE} from '@assets/exporter';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {useLazyFetchScheduledJobsQuery} from '@api/features/employee/employeeApi';
import {useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import ScheduledJobCard from '@components/employee/ScheduledJobCard';
import moment, {Moment} from 'moment';

const EmployeeSchedules = () => {
  const [refreshing, setIsRefreshing] = useState<boolean>(false);
  const user = useSelector(userBasicDetailsFromState);
  const [fetchScheduleJobs, {error}] = useLazyFetchScheduledJobsQuery();
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const styles = useThemeAwareObject(createStyles);
  const [scheduledJobs, setScheduledJobs] = useState<IJobPostTypes[]>([]);
  const [currentDayJobs, setCurrentDayJobs] = useState<IJobPostTypes[]>([]);

  const onRefresh = () => {
    fetchAppliedJobsHandler();
  };

  const fetchAppliedJobsHandler = withAsyncErrorHandlingGet(
    async () => {
      const appliedJobResponse = await fetchScheduleJobs({
        id: user?.details?.detailsId ?? 0,
        type: null,
      }).unwrap();
      if (appliedJobResponse) {
        setScheduledJobs(appliedJobResponse);

        const filteredCurrentJobs = appliedJobResponse.filter(job =>
          moment(job.eventDate).isSame(currentDate, 'day'),
        );
        setCurrentDayJobs(filteredCurrentJobs);
      }
      setIsRefreshing(false);
    },
    () => {
      setIsRefreshing(false);
    },
  );

  useEffect(() => {
    fetchAppliedJobsHandler();
  }, []);

  useEffect(() => {
    const filteredJobs = scheduledJobs.filter(job =>
      moment(job.eventDate).isSame(currentDate, 'day'),
    );
    setCurrentDayJobs(filteredJobs);
  }, [currentDate, scheduledJobs]);

  return (
    <OnBoardingBackground
      childrenStyles={styles.children}
      hideBack
      title={STRINGS.schedules}>
      <>
        <HorizontalCalendar
          onSelectDate={setCurrentDate}
          stateJobs={scheduledJobs}
        />
        <ScrollView
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }>
          <View style={styles.mainView}>
            {currentDayJobs.length > 0 && !error ? (
              currentDayJobs.map(job => (
                <ScheduledJobCard key={job.id} jobDetails={job} />
              ))
            ) : (
              <View style={styles.emptyView}>
                <EmptyState
                  data={currentDayJobs}
                  emptyListIllustration={IC_EMPTY_SCHEDULE}
                  emptyListMessage="No Scheduled Jobs"
                  emptyListSubTitle="Apply to more jobs. Your scheduled tasks will show up here."
                  errorObj={error}
                />
              </View>
            )}
            <View style={styles.footer} />
          </View>
        </ScrollView>
      </>
    </OnBoardingBackground>
  );
};

export default EmployeeSchedules;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    children: {
      paddingHorizontal: 0,
    },
    loadingView: {
      width: '100%',
      height: '100%',
      zIndex: 1,
      position: 'absolute',
      backgroundColor: '#fff',
      marginTop: verticalScale(32),
      paddingHorizontal: verticalScale(24),
    },
    headerLoading: {
      alignSelf: 'center',
      marginBottom: verticalScale(16),
      width: verticalScale(130),
      height: verticalScale(32),
      borderRadius: 8,
    },
    element: {
      width: verticalScale(37),
      height: verticalScale(56),
      backgroundColor: theme.color.skelton,
      borderRadius: 40,
    },
    mainView: {
      flex: 1,
      gap: verticalScale(12),
      marginHorizontal: verticalScale(24),
    },
    emptyView: {
      width: '100%',
      height: '100%',
    },
    body: {
      marginTop: verticalScale(40),
      gap: verticalScale(12),
    },
    footer: {
      height: verticalScale(150),
    },
  });
