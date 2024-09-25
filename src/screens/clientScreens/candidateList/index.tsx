import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import CandidateListTopView from '@components/client/CandidateListTopView';
import {verticalScale, windowWidth} from '@utils/metrics';
import CandidateListOpen from './CandidateListOpen';
import CandidateListDeclined from './CandidateListDeclined';
import CandidateListSelected from './CandidateListSelected';
import OpenJobsBottomSheet from '@components/client/OpenJobsBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useSelector} from 'react-redux';
import {openJobsFromState} from '@api/features/client/clientSlice';
import {IJobPostTypes} from '@api/features/client/types';

const CandidateList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const styles = useThemeAwareObject(getStyles);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const openJobFromState = useSelector(openJobsFromState);
  const bottomSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const [currentSelectedJob, setCurrentSelectedJob] =
    useState<IJobPostTypes | null>(null);
  const onPressTab = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * windowWidth,
      animated: true,
    });
  };

  useEffect(() => {
    setCurrentSelectedJob(openJobFromState[0]);
  }, []);

  const onChangeSelectedJobHandler = (job: IJobPostTypes) => {
    setCurrentSelectedJob(job);
    bottomSheetRef.current?.close();
  };

  const onPressFilter = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  return (
    <OnBoardingBackground
      childrenStyles={styles.mainView}
      hideBack
      title={STRINGS.candidateList}>
      <CandidateListTopView
        onPressFilter={onPressFilter}
        currentIndex={currentIndex}
        onClick={onPressTab}
        jobName={currentSelectedJob?.job_name ?? ''}
        jobId={currentSelectedJob?.id ?? 0}
      />
      <View style={styles.container}>
        <ScrollView
          snapToAlignment="center"
          pagingEnabled
          ref={scrollViewRef}
          horizontal>
          <View style={styles.screen}>
            <CandidateListOpen jobId={currentSelectedJob?.id ?? null} />
          </View>
          <View style={styles.screen}>
            <CandidateListSelected jobId={currentSelectedJob?.id ?? null} />
          </View>
          <View style={styles.screen}>
            <CandidateListDeclined jobId={currentSelectedJob?.id ?? null} />
          </View>
        </ScrollView>
      </View>
      <OpenJobsBottomSheet
        ref={bottomSheetRef}
        jobs={openJobFromState}
        currentSelectedJob={currentSelectedJob}
        onPressCard={onChangeSelectedJobHandler}
      />
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
