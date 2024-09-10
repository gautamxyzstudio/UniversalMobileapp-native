import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale, windowWidth} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {Theme} from '@theme/Theme.type';
import Spacers from '@components/atoms/Spacers';
import BrTag from '@components/atoms/brTag';

const JobPostCardLoading = () => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <View style={styles.container}>
      <Row spaceBetween>
        <Row alignCenter>
          <View style={styles.image} />
          <View style={styles.row}>
            <View style={styles.title} />
            <View style={styles.titleSec} />
          </View>
        </Row>
        <View style={styles.tag} />
      </Row>
      <Spacers size={24} scalable type="vertical" />
      <View style={styles.midContainer}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </View>
      <BrTag tagStyles={styles.br} />
      <Row spaceBetween>
        <View style={styles.bottomFirst} />
        <View style={styles.bottomFirst} />
      </Row>
    </View>
  );
};

export default JobPostCardLoading;
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    bottomFirst: {
      width: verticalScale(88),
      height: verticalScale(24),
      backgroundColor: theme.color.skelton,
      borderRadius: 20,
    },

    container: {
      padding: verticalScale(12),
      width: windowWidth - verticalScale(48),
      borderWidth: 1,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderColor: 'rgba(18, 18, 18, 0.16)',
      height: verticalScale(220.34),
    },
    image: {
      width: verticalScale(40),
      height: verticalScale(40),
      overflow: 'hidden',
      backgroundColor: theme.color.skelton,
      borderRadius: verticalScale(40),
    },
    row: {
      marginLeft: verticalScale(12),
    },
    title: {
      width: verticalScale(155),
      height: verticalScale(20),
      backgroundColor: theme.color.skelton,
      borderRadius: verticalScale(8),
    },
    titleSec: {
      width: verticalScale(124),
      height: verticalScale(18),
      backgroundColor: theme.color.skelton,
      marginTop: verticalScale(4),
      borderRadius: verticalScale(8),
    },
    tag: {
      width: verticalScale(49),
      height: verticalScale(24),
      borderRadius: 20,
      backgroundColor: theme.color.skelton,
    },
    midContainer: {
      gap: verticalScale(12),
    },
    line: {
      width: verticalScale(221),
      height: verticalScale(18),
      backgroundColor: theme.color.skelton,
      borderRadius: 20,
    },
    br: {
      backgroundColor: theme.color.strokeLight,
    },
  });
