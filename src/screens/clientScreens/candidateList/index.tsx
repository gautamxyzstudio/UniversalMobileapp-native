/* eslint-disable react-hooks/exhaustive-deps */
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
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
import {useTheme} from '@theme/Theme.context';
import {ActivityIndicator} from 'react-native-paper';
import EmptyState from '@screens/common/emptyAndErrorScreen';
import {EMPTY} from '@assets/exporter';
import UserDetailsViewSheetCandidateListProvider from '@screens/clientScreens/candidateList/UserDetailsViewCandidateList';

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
  const styles = useThemeAwareObject(getStyles);
  const [getJobPosts, {error}] = useLazyGetPostedJobQuery();
  const user = useSelector(userBasicDetailsFromState);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const {theme} = useTheme();
  const openJobFromState = useSelector(openJobsFromState);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const bottomSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const [currentSelectedJob, setCurrentSelectedJob] =
    useState<IJobPostTypes | null>(null);

  const onPressTab = (index: number) => {
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
        setIsLoading(false);
        setCurrentPage(page);
        setIsLastPage(
          response.data.length === 0 || response.data.length !== perPageRecord,
        );
        dispatch(saveOpenJobs({pageNo: page, jobs: response.data}));
      }
    },
    () => {
      setIsLoading(false);
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
    <UserDetailsViewSheetCandidateListProvider>
      <OnBoardingBackground
        childrenStyles={styles.mainView}
        hideBack
        title={STRINGS.candidateList}>
        {isLoading ? (
          <View style={styles.main}>
            <ActivityIndicator size={'large'} color={theme.color.darkBlue} />
          </View>
        ) : (
          <>
            <CandidateListTopView
              onPressFilter={onPressFilter}
              onPressTab={onPressTab}
              jobName={currentSelectedJob?.job_name ?? ''}
              jobId={currentSelectedJob?.id ?? 0}
              index={0}
            />
            <View style={styles.container}>
              {openJobFromState.length ? (
                <ScrollView
                  snapToAlignment="center"
                  pagingEnabled
                  scrollEnabled={false}
                  contentContainerStyle={styles.flex}
                  ref={scrollViewRef}
                  horizontal>
                  <View style={styles.screen}>
                    <CandidateListOpen jobId={currentSelectedJob?.id ?? null} />
                  </View>
                  <View style={styles.screen}>
                    <CandidateListSelected
                      jobId={currentSelectedJob?.id ?? null}
                    />
                  </View>
                  <View style={styles.screen}>
                    <CandidateListDeclined
                      jobId={currentSelectedJob?.id ?? null}
                    />
                  </View>
                </ScrollView>
              ) : (
                <EmptyState
                  emptyListIllustration={EMPTY}
                  emptyListSubTitle={STRINGS.no_jobs_posted_yet}
                  emptyListMessage={STRINGS.no_jobs_posted_yet}
                  errorObj={error}
                />
              )}
            </View>
          </>
        )}
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
    </UserDetailsViewSheetCandidateListProvider>
  );
};

export default CandidateList;

const getStyles = () => {
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
    flex: {
      flexGrow: 1,
    },
    main: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return styles;
};
