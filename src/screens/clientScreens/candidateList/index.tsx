import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import CandidateListTopView from '@components/client/CandidateListTopView';
import {verticalScale, windowWidth} from '@utils/metrics';
import CandidateListOpen from './CandidateListOpen';
import CandidateListDeclined from './CandidateListDeclined';
import CandidateListSelected from './CandidateListSelected';

const CandidateList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const styles = useThemeAwareObject(getStyles);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const onPressTab = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * windowWidth,
      animated: true,
    });
  };

  return (
    <OnBoardingBackground
      childrenStyles={styles.mainView}
      hideBack
      title={STRINGS.candidateList}>
      <CandidateListTopView currentIndex={currentIndex} onClick={onPressTab} />
      <View style={styles.container}>
        <ScrollView ref={scrollViewRef} horizontal>
          <View style={styles.screen}>
            <CandidateListOpen />
          </View>
          <View style={styles.screen}>
            <CandidateListSelected />
          </View>
          <View style={styles.screen}>
            <CandidateListDeclined />
          </View>
        </ScrollView>
      </View>
    </OnBoardingBackground>
  );
};

export default CandidateList;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: verticalScale(16),
      flex: 1,
    },
    mainView: {
      paddingTop: 0,
      paddingHorizontal: 0,
    },
    screen: {
      width: windowWidth,
      flex: 1,
    },
  });
  return styles;
};
