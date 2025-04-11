/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import {useTheme} from '@theme/Theme.context';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import {NOTIFICATION_READ} from '@assets/exporter';
import NotificationCard from '@components/notifications/notificationCard';
import CustomList from '@components/molecules/customList';
import {
  useLazyGetJobDetailsQuery,
  useLazyGetNotificationsQuery,
  useMarkAllReadMutation,
  useUpdateNotificationStatusMutation,
} from '@api/features/user/userApi';
import {useDispatch, useSelector} from 'react-redux';
import {userAdvanceDetailsFromState} from '@api/features/user/userSlice';
import {INotification} from '@api/features/user/types';
import {ActivityIndicator} from 'react-native-paper';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {ICustomErrorResponse} from '@api/types';
import {useJobDetailsContext} from 'src/contexts/displayJobDetailsContext';
import {showToast} from '@components/organisms/customToast';
import {setLoading} from '@api/features/loading/loadingSlice';

const Notifications = () => {
  const {theme} = useTheme();
  const user = useSelector(userAdvanceDetailsFromState);
  const dispatch = useDispatch();
  const toast = useToast();
  const [getJobDetails] = useLazyGetJobDetailsQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [markAllRead] = useMarkAllReadMutation();
  const [getNotifications, {isFetching}] = useLazyGetNotificationsQuery();
  const [updateNotification] = useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(true);
  const {onPressSheet} = useJobDetailsContext();
  // const updateNotificationStatus = withAsyncErrorHandlingPost(
  //   async (notificationId: number) => {
  //     const response = await updateNotification({notificationId}).unwrap();
  //     if (response) {
  //       setNotifications(prev =>
  //         prev.map(item =>
  //           item.id === notificationId ? {...item, status: 'read'} : item,
  //         ),
  //       );
  //       navigation.navigate('employeeTabBar', {
  //         screen: employeeTabBarRoutes.jobs,
  //       } as unknown as undefined);
  //     }
  //   },
  //   toast,
  //   dispatch,
  //   (error?: ICustomErrorResponse) => {
  //     console.log('error', error);
  //   },
  // );

  const updateNotificationStatus = useCallback(
    async (notificationId: number, jobId: number) => {
      try {
        dispatch(setLoading(true));
        const response = await updateNotification({notificationId}).unwrap();
        setNotifications(prev => prev.map(item => ({...item, status: 'read'})));
        if (response) {
          const jobDetails = await getJobDetails({
            jobId: jobId,
            userId: user?.detailsId ?? 0,
          }).unwrap();
          onPressSheet('show', jobDetails);
        }
      } catch (error) {
        showToast(toast, STRINGS.something_went_wrong, 'error');
        console.log('error', error);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [onPressSheet],
  );

  const renderItem = useCallback(({item}: {item: INotification}) => {
    return (
      <NotificationCard
        notification={item}
        updateNotificationStatus={updateNotificationStatus}
      />
    );
  }, []);

  const getNotificationsHandler = async (isFirstPage: boolean = false) => {
    try {
      let page = isFirstPage ? 1 : currentPage + 1;
      if (user?.detailsId) {
        const response = await getNotifications({
          employeeId: user?.detailsId,
          page: page,
          pageSize: 10,
        }).unwrap();
        setNotifications(prev =>
          isFirstPage ? response.data : [...prev, ...response.data],
        );
        setCurrentPage(page);
        setIsLastPage(
          response.data.length === 0 || page === response?.meta?.pageCount,
        );
        setRefreshing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreNotifications = () => {
    if (!isLastPage) {
      getNotificationsHandler();
    }
  };

  useEffect(() => {
    getNotificationsHandler(true);
  }, []);

  const markAllReadHandler = withAsyncErrorHandlingPost(
    async () => {
      const response = await markAllRead({
        employeeId: user?.detailsId ?? 0,
      }).unwrap();
      if (response) {
        setNotifications(prev => prev.map(item => ({...item, status: 'read'})));
        toast.show(STRINGS.all_notifications_marked_as_read);
      }
    },
    toast,
    dispatch,
    (error?: ICustomErrorResponse) => {
      console.log('error', error);
    },
  );

  const onRefresh = () => {
    setRefreshing(true);
    getNotificationsHandler(true);
  };

  return (
    <SafeAreaView hideBottomSpace backgroundColor={theme.color.primary}>
      <View style={styles.container}>
        <View style={styles.mainView}>
          <HeaderWithBack
            renderRightIcon
            icon={NOTIFICATION_READ}
            onPressRightIcon={markAllReadHandler}
            headerTitle={STRINGS.notifications}
            isDark
          />
        </View>
        {isFetching && currentPage === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <CustomList
            data={notifications}
            estimatedItemSize={verticalScale(65)}
            renderItem={renderItem}
            onRefresh={onRefresh}
            refreshing={refreshing}
            getItemType={item => `${item.id}`}
            betweenItemSpace={verticalScale(4)}
            error={undefined}
            isLastPage={isLastPage}
            onEndReached={loadMoreNotifications}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    paddingHorizontal: verticalScale(24),
    marginBottom: verticalScale(24),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
