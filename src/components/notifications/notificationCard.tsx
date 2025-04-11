import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Row} from '@components/atoms/Row';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {ICONS} from '@assets/exporter';
import {fromNowOn} from '@utils/utils.common';
import {INotification} from '@api/features/user/types';
import CustomImageComponent from '@components/atoms/customImage';

type INotificationPropsTypes = {
  notification: INotification;
  updateNotificationStatus: (notificationId: number, jobId: number) => void;
};

const NotificationCard: React.FC<INotificationPropsTypes> = ({
  notification,
  updateNotificationStatus,
}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);
  const isRead = notification.status === 'read';

  const onPressHandler = () => {
    if (!isRead) {
      updateNotificationStatus(notification.id, notification.JobID);
    }
  };
  return (
    <Pressable
      onPress={onPressHandler}
      style={[styles.row, !isRead && {backgroundColor: theme.color.ternary}]}>
      {!isRead && <View style={styles.dot} />}
      <Row alignCenter>
        <CustomImageComponent
          defaultSource={ICONS.imagePlaceholder}
          image={notification.icon?.url ?? ''}
          customStyle={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.notificationTextBold}>
            {notification.message}
          </Text>
          <Text style={styles.timeText}>
            {fromNowOn(notification.updatedAt)}
          </Text>
        </View>
      </Row>
    </Pressable>
  );
};

export default NotificationCard;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    row: {
      paddingLeft: verticalScale(24),
      backgroundColor: theme.color.backgroundWhite,
      paddingVertical: verticalScale(12),
      justifyContent: 'center',
      paddingRight: verticalScale(24),
    },
    image: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: verticalScale(20),
    },
    notificationText: {
      color: theme.color.textPrimary,
      ...fonts.small,
    },
    dot: {
      width: verticalScale(8),
      height: verticalScale(8),
      borderRadius: verticalScale(4),
      backgroundColor: theme.color.green,
      left: verticalScale(8),
      position: 'absolute',
    },
    notificationTextBold: {
      color: theme.color.textPrimary,
      ...fonts.smallBold,
    },
    textContainer: {
      marginLeft: verticalScale(8),
      flex: 1,
    },
    timeText: {
      marginTop: verticalScale(4),
      ...fonts.small,
      color: theme.color.disabled,
    },
  });
  return styles;
};
