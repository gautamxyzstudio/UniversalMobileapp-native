import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';

const HelpAndSupportCardLoading = () => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <Row spaceBetween>
        <View style={styles.skeltonOne} />
        <View style={styles.skeltonOne} />
      </Row>
      <View style={styles.content}>
        <View style={styles.skeltonTwo} />
        <View style={styles.skeltonTwo} />
      </View>
    </View>
  );
};

export default HelpAndSupportCardLoading;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.color.strokeLight,
      padding: verticalScale(12),
      borderRadius: 4,
    },
    skeltonOne: {
      width: '30%',
      height: verticalScale(20),
      borderRadius: 8,
      backgroundColor: theme.color.skelton,
    },
    content: {
      marginTop: verticalScale(12),
      gap: verticalScale(4),
    },
    skeltonTwo: {
      width: '100%',
      height: verticalScale(14),
      borderRadius: 8,
      backgroundColor: theme.color.skelton,
    },
  });
  return styles;
};
