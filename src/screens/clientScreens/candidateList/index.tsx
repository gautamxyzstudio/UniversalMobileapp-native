import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';

const CandidateList = () => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <OnBoardingBackground hideBack title={STRINGS.candidateList}>
      <Text>ehl</Text>
    </OnBoardingBackground>
  );
};

export default CandidateList;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backgroundWhite,
    },
  });
  return styles;
};
