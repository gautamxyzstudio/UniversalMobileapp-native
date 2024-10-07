import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';

const ScheduleCardLoading = () => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Row spaceBetween alignCenter>
          <View style={styles.row} />
          <View style={styles.rowTwo} />
        </Row>
        <View style={styles.bottomContainer}>
          <View style={styles.rowFour} />
          <View style={styles.rowThree} />
        </View>
      </View>
    </View>
  );
};

export default ScheduleCardLoading;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: verticalScale(116),
      backgroundColor: theme.color.backgroundWhite,
      borderRadius: 4,
      overflow: 'hidden',
      borderLeftWidth: 4,
      borderColor: theme.color.skelton,
    },
    mainView: {
      flex: 1,
      justifyContent: 'space-between',
      padding: verticalScale(12),
    },
    row: {
      width: verticalScale(115),
      height: verticalScale(20),
      borderRadius: 4,
      backgroundColor: theme.color.skelton,
    },
    rowThree: {
      width: verticalScale(210),
      height: verticalScale(20),
      borderRadius: 4,
      backgroundColor: theme.color.skelton,
    },
    rowFour: {
      width: verticalScale(180),
      height: verticalScale(20),
      borderRadius: 4,
      backgroundColor: theme.color.skelton,
    },
    rowTwo: {
      width: verticalScale(63),
      height: verticalScale(16),
      borderRadius: 4,
      backgroundColor: theme.color.skelton,
    },
    bottomContainer: {
      gap: verticalScale(8),
    },
  });
