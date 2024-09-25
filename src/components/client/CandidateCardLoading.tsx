import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';

const CandidateCardLoading = () => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <Row alignCenter>
        <View style={styles.profilePicture} />
        <View style={styles.lineContainer}>
          <View style={styles.lineOne} />
          <View style={styles.lineTwo} />
        </View>
      </Row>
    </View>
  );
};

export default CandidateCardLoading;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.color.primary,
      padding: verticalScale(12),
      height: verticalScale(72.66),
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(18, 18, 18, 0.08)',
    },
    profilePicture: {
      width: verticalScale(48),
      height: verticalScale(48),
      backgroundColor: theme.color.skelton,
      borderRadius: verticalScale(24),
      overflow: 'hidden',
    },
    lineOne: {
      width: verticalScale(105),
      borderRadius: 8,
      height: verticalScale(20),
      backgroundColor: theme.color.skelton,
    },
    lineTwo: {
      width: verticalScale(135),
      height: verticalScale(20),
      borderRadius: 8,
      backgroundColor: theme.color.skelton,
    },
    lineContainer: {
      gap: verticalScale(2),
      marginLeft: verticalScale(8),
    },
  });
