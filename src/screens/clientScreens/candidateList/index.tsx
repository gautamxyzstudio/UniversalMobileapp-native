/* eslint-disable react-hooks/exhaustive-deps */
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
import {useDispatch, useSelector} from 'react-redux';
import {
  openJobsFromState,
  saveOpenJobs,
} from '@api/features/client/clientSlice';
import {IJobPostTypes} from '@api/features/client/types';
import {useLazyGetPostedJobQuery} from '@api/features/client/clientApi';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';

type ICandidateListProps = {
  route: {
    params?: {
      jobId: number | undefined;
    };
  };
};

const CandidateList: React.FC<ICandidateListProps> = ({route}) => {
  // console.log(route.params?.jobId, 'JOB ID');
  let selectedJobId = route.params?.jobId;
  const [currentIndex, setCurrentIndex] = useState(0);
  const styles = useThemeAwareObject(getStyles);
  const [getJobPosts, {error}] = useLazyGetPostedJobQuery();
  const user = useSelector(userBasicDetailsFromState);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const openJobFromState = useSelector(openJobsFromState);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
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

  const getJobPostsHandler = withAsyncErrorHandlingGet(
    async (isFirstPage: boolean = false) => {
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 10;
      if (isFirstPage) {
        setIsRefreshing(true);
      }
      const response = await getJobPosts(user?.details?.detailsId).unwrap();
      if (response.data) {
        setIsRefreshing(false);
        setCurrentPage(page);
        setIsLastPage(
          response.data.length === 0 || response.data.length !== perPageRecord,
        );
        dispatch(saveOpenJobs({pageNo: page, jobs: response.data}));
      }
    },
    () => {
      setIsRefreshing(false);
    },
  );

  useEffect(() => {
    setCurrentSelectedJob(openJobFromState[0]);
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      let jobIndex = openJobFromState.findIndex(j => j.id === selectedJobId);
      if (jobIndex !== -1) {
        setCurrentSelectedJob(openJobFromState[jobIndex]);
      }
    }
  }, [selectedJobId]);

  const onChangeSelectedJobHandler = (job: IJobPostTypes) => {
    setCurrentSelectedJob(job);
    bottomSheetRef.current?.close();
  };

  const onPressFilter = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const loadMore = () => {
    if (!isLastPage) {
      getJobPostsHandler();
    }
  };

  useEffect(() => {
    getJobPostsHandler(true);
  }, []);

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
          contentContainerStyle={{flexGrow: 1}}
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
        onReachEnd={loadMore}
        onRefresh={() => getJobPostsHandler(true)}
        isRefreshing={isRefreshing}
      />
    </OnBoardingBackground>
  );
};

export default CandidateList;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: verticalScale(16),
      flexGrow: 1,
    },
    mainView: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    screen: {
      width: windowWidth,
      flex: 1,
    },
  });
  return styles;
};
