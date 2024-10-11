import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import {IJobPostTypes} from '@api/features/client/types';
import {useGetClientScheduleQuery} from '@api/features/client/clientApi';
import {useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {Moment} from 'moment';
import moment from 'moment';
import {IC_EMPTY_SCHEDULE} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import HorizontalCalendar from '@components/employee/HorizontalCalendar';
import ScheduleCardLoading from '@components/employee/ScheduleCardLoading';
import EmptyState from '@screens/common/emptyAndErrorScreen';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import ScheduledEventCard from '@components/client/ScheduleEventCard';

const ClientSchedules = () => {
  const user = useSelector(userBasicDetailsFromState);
  const {data, isLoading, error, refetch} = useGetClientScheduleQuery({
    clientId: user?.details?.detailsId ?? 0,
  });
  const styles = useThemeAwareObject(createStyles);
  const [refreshing, setIsRefreshing] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const [scheduledJobs, setScheduledJobs] = useState<IJobPostTypes[]>([]);
  const [currentDayJobs, setCurrentDayJobs] = useState<IJobPostTypes[]>([]);

  useEffect(() => {
    if (data) {
      setScheduledJobs(data);
      const filteredCurrentJobs = data.filter(job =>
        moment(job.eventDate).isSame(currentDate, 'day'),
      );
      setIsRefreshing(false);
      setCurrentDayJobs(filteredCurrentJobs);
    }
  }, [currentDate, data]);

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
      {isLoading && (
        <View style={styles.loadingView}>
          <View style={styles.headerLoading} />
          <Row spaceBetween>
            {[...Array(6)].map((_, idx) => (
              <View key={idx} style={styles.element} />
            ))}
          </Row>
          <View style={styles.body}>
            <ScheduleCardLoading />
            <ScheduleCardLoading />
          </View>
        </View>
      )}
      <HorizontalCalendar
        onSelectDate={setCurrentDate}
        stateJobs={scheduledJobs}
      />
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={refreshing} />
        }>
        <View style={styles.mainView}>
          {currentDayJobs.length > 0 && !error ? (
            currentDayJobs.map(job => (
              <ScheduledEventCard key={job.id} jobDetails={job} />
            ))
          ) : (
            <View style={styles.emptyView}>
              <EmptyState
                data={currentDayJobs}
                emptyListIllustration={IC_EMPTY_SCHEDULE}
                emptyListMessage="No Scheduled Events"
                emptyListSubTitle="Apply to more jobs. Your scheduled tasks will show up here."
                errorObj={error}
              />
            </View>
          )}
          <View style={styles.footer} />
        </View>
      </ScrollView>
    </OnBoardingBackground>
  );
};

export default ClientSchedules;

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
    footer: {
      height: verticalScale(150),
    },
    headerLoading: {
      alignSelf: 'center',
      marginBottom: verticalScale(16),
      width: verticalScale(130),
      backgroundColor: theme.color.skelton,
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
      flex: 1,
      marginBottom: verticalScale(50),
    },
    body: {
      marginTop: verticalScale(40),
      gap: verticalScale(12),
    },
  });
