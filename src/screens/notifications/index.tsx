import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import SafeAreaView from '@components/safeArea';
import {useTheme} from '@theme/Theme.context';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import {NOTIFICATION_READ} from '@assets/exporter';
import NotificationCard from '@components/notifications/notificationCard';
import CustomList from '@components/molecules/customList';
import {INotification} from '@api/types';
import {mockNotifications} from '@api/mockData';

const Notifications = () => {
  const {theme} = useTheme();

  const renderItem = useCallback(({item}: {item: INotification}) => {
    return (
      <NotificationCard
        title={item.title}
        icon={item.icon}
        highlightText={item.highlightText}
        isRead={item.isRead}
        time={item.time}
      />
    );
  }, []);

  return (
    <SafeAreaView hideBottomSpace backgroundColor={theme.color.primary}>
      <View style={styles.container}>
        <View style={styles.mainView}>
          <HeaderWithBack
            renderRightIcon
            icon={NOTIFICATION_READ}
            headerTitle={STRINGS.notifications}
            isDark
          />
        </View>
        <CustomList
          data={mockNotifications}
          estimatedItemSize={verticalScale(65)}
          renderItem={renderItem}
          getItemType={item => `${item.id}`}
          betweenItemSpace={verticalScale(4)}
          error={undefined}
          isLastPage={true}
        />
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
});
