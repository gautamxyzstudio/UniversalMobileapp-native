/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import {setLoading} from '@api/features/loading/loadingSlice';
import {
  useLazyGetJobDetailsQuery,
  useUpdateFcmTokenMutation,
} from '@api/features/user/userApi';
import {
  fcmTokenInState,
  updateFcmToken,
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
  userTokenInState,
} from '@api/features/user/userSlice';
import {useAppDispatch, useAppSelector} from '@api/store';
import {showToast} from '@components/organisms/customToast';
import messaging from '@react-native-firebase/messaging';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import {STRINGS} from 'src/locales/english';
import {useJobDetailsContext} from './displayJobDetailsContext';
import {
  clientTabBarRoutes,
  employeeTabBarRoutes,
  navigationRef,
} from 'src/navigator/types';

interface NotificationContextProps {
  fcmToken: string;
  subscribe: (callback: Function) => void;
  unsubscribe: (callback: Function) => void;
  getInitialNotification: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export interface NotificationMessage {
  messageId?: string;
  messageType?: string;
  from?: string;
  to?: string;
  ttl?: number;
  sentTime?: number;
  data?: {[key: string]: string | object};
  notification?: {body?: string; icon?: string; title?: string};
  contentAvailable?: boolean;
  mutableContent?: boolean;
  category?: string;
  threadId?: string;
}

export const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // State management
  const fcmTokenState = useAppSelector(fcmTokenInState);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const toast = useToast();
  const authToken = useSelector(userTokenInState);
  const userBasic = useSelector(userBasicDetailsFromState);
  const user = useSelector(userAdvanceDetailsFromState);
  const [getJobDetails] = useLazyGetJobDetailsQuery();
  const dispatch = useAppDispatch();
  const [updateFcmHandler] = useUpdateFcmTokenMutation();
  const [subscribers, setSubscribers] = useState<Function[]>([]);
  const [notification, setNotification] = useState<NotificationMessage | null>(
    null,
  );
  const {onPressSheet} = useJobDetailsContext();
  // Initialize Firebase listeners and check for initial notification on mount
  useEffect(() => {
    const unsubscribe = setupFirebaseListeners();
    getInitialNotification();
    return unsubscribe;
  }, []);

  // Handle initial notification when the app is launched from a killed state
  const getInitialNotification = async () => {
    try {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        handleRemoteNotification(initialNotification, true);
      }
    } catch (error) {
      console.error('Error getting initial notification:', error);
    }
  };

  // TODO: Implement notification navigation logic
  const handleNotificationRedirection = (notification: NotificationMessage) => {
    // if (notification.notification?.title === 'Job Status Updated') {
    //   navigationRef.navigate('employeeTabBar', {
    //     screen: employeeTabBarRoutes.jobs,
    //   } as unknown as undefined);
    // }
  };

  // Central handler for all incoming notifications
  const handleRemoteNotification = (
    notification: NotificationMessage,
    forceRedirection: boolean = false,
  ) => {
    notifySubscribers(notification);
    if (forceRedirection) {
      handleNotificationRedirection(notification);
    } else {
      setNotification(notification);
    }
  };

  console.log('notification', notification);
  // Log notifications when they are updated
  useEffect(() => {
    if (notification) {
      showToast(
        toast,
        notification.notification?.title ?? '',
        'notification',
        notification.notification?.body ?? '',
        () => handleNotificationOnPress(notification),
      );
    }
  }, [notification]);

  const handleNotificationOnPress = async (
    notification: NotificationMessage,
  ) => {
    if (userBasic?.user_type === 'emp') {
      if (notification && notification.data?.JobId && user?.detailsId) {
        const jobId = notification.data?.JobId;
        try {
          dispatch(setLoading(true));
          const jobDetails = await getJobDetails({
            jobId: jobId as unknown as number,
            userId: user?.detailsId ?? 0,
          }).unwrap();
          onPressSheet('show', jobDetails);
        } catch (error) {
          showToast(toast, STRINGS.something_went_wrong, 'error');
          console.log('error', error);
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        if (notification.notification?.title === 'Job Status Updated') {
          navigationRef.navigate('employeeTabBar', {
            screen: employeeTabBarRoutes.jobs,
          } as unknown as undefined);
        }
      }
    } else {
      if (notification?.data?.jobId) {
        navigationRef.navigate('clientTabBar', {
          screen: clientTabBarRoutes.contactList,
          params: {
            jobId: notification?.data?.jobId,
          },
        } as unknown as undefined);
      }
    }
  };

  // Handle FCM token changes: update Redux store if changed or fetch new token
  useEffect(() => {
    if (authToken) {
      getFcmToken();
    }
  }, [authToken]); // Removed fcmToken from dependencies

  // Request permissions and fetch the FCM token.
  // For iOS, ensure that an APNS token is registered first.
  const getFcmToken = async () => {
    try {
      // Request Android notification permissions
      if (Platform.OS === 'android') {
        const permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (permissionStatus !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Notification permission denied');
          return;
        }
      }
      if (Platform.OS === 'ios') {
        const isRegistered =
          await messaging().registerDeviceForRemoteMessages();
        console.log('isRegistered', isRegistered);
      }

      // Request permission (applies to both platforms)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        if (token) {
          await updateFcmTokenHandler(token);
        } else {
          console.log('same Fcm token', token);
        }
      } else {
        console.warn('FCM permission not granted');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  // Subscription management for notification listeners
  const subscribe = (callback: Function) => {
    setSubscribers(prev => [...prev, callback]);
  };

  const unsubscribe = (callback: Function) => {
    setSubscribers(prev => prev.filter(cb => cb !== callback));
  };

  // Update FCM token in local state and Redux store
  const updateFcmTokenHandler = async (token: string) => {
    try {
      const response = await updateFcmHandler({firebaseToken: token}).unwrap();
      if (response) {
        setFcmToken(token);
        dispatch(updateFcmToken(token));
      }
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  };

  // Setup Firebase message listeners for various app states
  const setupFirebaseListeners = () => {
    const unsubscribers = [
      // Foreground message handler
      messaging().onMessage(async remoteMessage => {
        try {
          handleRemoteNotification(remoteMessage);
        } catch (error) {
          console.error('Error handling foreground message:', error);
        }
      }),

      // Opened app from notification handler
      messaging().onNotificationOpenedApp(remoteMessage => {
        try {
          handleRemoteNotification(remoteMessage, true);
        } catch (error) {
          console.error('Error handling opened app notification:', error);
        }
      }),

      // Background message handler
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        try {
          handleRemoteNotification(remoteMessage, true);
        } catch (error) {
          console.error('Error handling background message:', error);
        }
      }),

      // Token refresh handler
      messaging().onTokenRefresh(token => {
        try {
          updateFcmTokenHandler(token);
        } catch (error) {
          console.error('Error refreshing FCM token:', error);
        }
      }),
    ];
    // Cleanup function to remove listeners
    return () => {
      unsubscribers.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  };

  // Notify all subscribers with the new notification data
  const notifySubscribers = (data: NotificationMessage) => {
    subscribers.forEach(sub => sub(data));
  };

  const contextValue: NotificationContextProps = {
    fcmToken: fcmToken || '',
    subscribe,
    unsubscribe,
    getInitialNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationContext',
    );
  }
  return context;
};
