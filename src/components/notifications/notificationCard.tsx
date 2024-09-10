import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {Row} from '@components/atoms/Row';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import {fonts} from '@utils/common.styles';
import HighlightText from '@sanar/react-native-highlight-text';
import {useTheme} from '@theme/Theme.context';
import {ICONS} from '@assets/exporter';
import {fromNowOn} from '@utils/utils.common';

type INotificationPropsTypes = {
  title: string;
  icon: string | undefined;
  isRead: boolean;
  highlightText: string;
  time: string;
};

const NotificationCard: React.FC<INotificationPropsTypes> = ({
  title,
  time,
  isRead,
  highlightText,
}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <Pressable
      style={[styles.row, !isRead && {backgroundColor: theme.color.ternary}]}>
      {!isRead && <View style={styles.dot} />}
      <Row alignCenter>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={ICONS.imagePlaceholder}
        />
        {/* <CustomImageComponent
          defaultSource={ICONS.imagePlaceholder}
          image={icon}
          resizeMode="cover"
          customStyle={styles.image}
        /> */}
        <View style={styles.textContainer}>
          <HighlightText
            highlightStyle={styles.notificationTextBold}
            searchWords={[highlightText]}
            style={styles.notificationText}
            textToHighlight={title}
          />
          <Text style={styles.timeText}>{fromNowOn(time)}</Text>
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
