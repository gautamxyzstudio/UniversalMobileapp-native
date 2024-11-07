import {StyleSheet, View} from 'react-native';
import React from 'react';
import CardOuter from '@components/atoms/CardOuter';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';

const ShortlistedCandidateLoadingCard = () => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <CardOuter>
      <View style={styles.mainView}>
        <Row alignCenter>
          <View style={styles.profilePicView} />
          <View style={styles.name}>
            <View style={styles.lineOne} />
            <View style={styles.lineTwo} />
          </View>
        </Row>
        <View style={styles.midDiv}>
          <Row spaceBetween>
            <View style={styles.lineOne} />
            <View style={styles.lineOne} />
          </Row>
          <Row spaceBetween>
            <View style={styles.lineOne} />
            <View style={styles.lineOne} />
          </Row>
        </View>
        <Row spaceBetween>
          <View style={styles.button} />
          <View style={styles.button} />
        </Row>
      </View>
    </CardOuter>
  );
};

export default ShortlistedCandidateLoadingCard;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      height: verticalScale(172),
    },
    profilePicView: {
      width: verticalScale(32),
      height: verticalScale(32),
      borderRadius: verticalScale(16),
      backgroundColor: theme.color.ternary,
    },
    lineOne: {
      height: verticalScale(18),
      width: verticalScale(105),
      borderRadius: 8,
      backgroundColor: theme.color.ternary,
    },
    name: {
      gap: verticalScale(2),
      marginLeft: verticalScale(8),
    },
    lineTwo: {
      height: verticalScale(14),
      width: verticalScale(85),
      borderRadius: 8,
      backgroundColor: theme.color.ternary,
    },
    midDiv: {
      marginVertical: 20,
      gap: 16,
    },
    button: {
      width: verticalScale(150),
      height: verticalScale(48),
      borderRadius: 8,
      backgroundColor: theme.color.ternary,
    },
  });
  return styles;
};
