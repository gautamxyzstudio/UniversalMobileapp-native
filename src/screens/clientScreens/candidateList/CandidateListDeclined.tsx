import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import CandidateCard from '@components/client/CandidateCard';

const CandidateListDeclined = () => {
  const styles = useThemeAwareObject(getStyles);
  return <View style={styles.container}>{/* <CandidateCard /> */}</View>;
};

export default CandidateListDeclined;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
  });
  return styles;
};
