/* eslint-disable react-hooks/exhaustive-deps */
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
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
  candidateListFromState,
  saveOpenJobs,
} from '@api/features/client/clientSlice';
import {ICandidateListTypes} from '@api/features/client/types';
import {useLazyGetPostedJobQuery} from '@api/features/client/clientApi';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {userAdvanceDetailsFromState} from '@api/features/user/userSlice';
import {useTheme} from '@theme/Theme.context';
import {ActivityIndicator} from 'react-native-paper';
import UserDetailsViewSheetCandidateListProvider from '@screens/clientScreens/candidateList/UserDetailsViewCandidateList';
import CandidateListActionsBottomSheetContextProvider from './CandidateListActionsBottomSheetContext';
import EmptyState from '@screens/common/emptyAndErrorScreen';
import {IC_CSV, IC_NO_CANDIDATES} from '@assets/exporter';
import {timeOutTimeSheets} from 'src/constants/constants';
import {IClientDetails} from '@api/features/user/types';
import {writeDataAndDownloadExcelFile} from '@utils/generatecsv';
import {useToast} from 'react-native-toast-notifications';

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
  const user = useSelector(userAdvanceDetailsFromState) as IClientDetails;
  const candidateJobs = useSelector(candidateListFromState);
  const [localCandidatesLength, setLocalCandidatesLength] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const {theme} = useTheme();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [isJobsUpdated, setIsJobsUpdated] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState(true);
  const bottomSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const [currentSelectedJob, setCurrentSelectedJob] =
    useState<ICandidateListTypes | null>(null);

  const getJobPostsHandler = withAsyncErrorHandlingGet(
    async (isFirstPage: boolean = false) => {
      setIsLoading(true);
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 100;
      const response = await getJobPosts(user.company?.id).unwrap();
      if (response.data) {
        setIsRefreshing(false);
        setIsLoading(false);
        setCurrentPage(page);
        setIsLastPage(
          response.data.length === 0 || response.data.length !== perPageRecord,
        );
        dispatch(saveOpenJobs({pageNo: page, jobs: response.data}));
        setIsJobsUpdated(true);
      }
    },
    () => {
      setIsLoading(false);
      setIsRefreshing(false);
    },
  );

  useEffect(() => {
    if (selectedJobId) {
      let jobIndex = candidateJobs.findIndex(
        j => j.details.jobId === selectedJobId,
      );

      if (jobIndex !== -1) {
        setCurrentSelectedJob(candidateJobs[jobIndex]);
      }
    }
  }, [selectedJobId, isJobsUpdated]);

  useEffect(() => {
    if (candidateJobs) {
      setCurrentSelectedJob(candidateJobs[0]);
    }
  }, [localCandidatesLength]);

  useEffect(() => {
    setLocalCandidatesLength(() => candidateJobs.length);
  }, [candidateJobs]);

  const onPressTab = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * windowWidth,
      animated: true,
    });
  };

  const onChangeSelectedJobHandler = (candidateJob: ICandidateListTypes) => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setCurrentSelectedJob(candidateJob);
    }, timeOutTimeSheets);
  };

  const onPressFilter = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const loadMore = () => {
    if (!isLastPage) {
      getJobPostsHandler();
    }
  };

  const onRefreshHandler = () => {
    setCurrentPage(1);
    setIsRefreshing(true);
    getJobPostsHandler(true);
  };

  useEffect(() => {
    getJobPostsHandler(true);
  }, []);

  const downloadExcelHandler = () => {
    let sample_data_to_export = [
      {id: '1', name: 'first'},
      {id: '2', name: 'second'},
    ];
    writeDataAndDownloadExcelFile(
      sample_data_to_export,
      'sample',
      dispatch,
      toast,
    );
  };

  return (
    <UserDetailsViewSheetCandidateListProvider>
      <CandidateListActionsBottomSheetContextProvider>
        <OnBoardingBackground
          childrenStyles={styles.mainView}
          hideBack
          displayRightIcon
          rightIcon={IC_CSV}
          rightIconPressHandler={downloadExcelHandler}
          title={STRINGS.candidateList}>
          {isLoading && (
            <View style={styles.main}>
              <ActivityIndicator size={'large'} color={theme.color.darkBlue} />
            </View>
          )}
          {!isLoading && !error && candidateJobs.length !== 0 && (
            <View style={styles.container}>
              <ScrollView
                style={styles.flexMain}
                scrollEnabled={true}
                contentContainerStyle={styles.scrollMain}
                refreshControl={
                  <RefreshControl
                    progressBackgroundColor={theme.color.darkBlue}
                    onRefresh={onRefreshHandler}
                    refreshing={isRefreshing}
                  />
                }>
                <CandidateListTopView
                  onPressFilter={onPressFilter}
                  onPressTab={onPressTab}
                  jobName={currentSelectedJob?.details.jobName ?? ''}
                  jobId={currentSelectedJob?.details.jobId ?? 0}
                  index={0}
                />
                <View style={styles.container}>
                  <ScrollView
                    snapToAlignment="center"
                    pagingEnabled
                    style={styles.container}
                    scrollEnabled={false}
                    contentContainerStyle={styles.flex}
                    ref={scrollViewRef}
                    horizontal>
                    <View style={styles.screen}>
                      <CandidateListOpen
                        jobId={currentSelectedJob?.details.jobId ?? null}
                      />
                    </View>
                    <View style={styles.screen}>
                      <CandidateListSelected
                        jobId={currentSelectedJob?.details.jobId ?? null}
                      />
                    </View>
                    <View style={styles.screen}>
                      <CandidateListDeclined
                        jobId={currentSelectedJob?.details.jobId ?? null}
                      />
                    </View>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          )}
          {!isLoading && (error || candidateJobs.length === 0) && (
            <View style={styles.emptyView}>
              <EmptyState
                emptyListIllustration={IC_NO_CANDIDATES}
                data={candidateJobs}
                withRefetch
                refreshHandler={() => getJobPostsHandler(true)}
                emptyListSubTitle={STRINGS.no_jobs_created_description}
                emptyListMessage={STRINGS.no_jobs_posted_yet}
                errorObj={error}
              />
            </View>
          )}

          <OpenJobsBottomSheet
            ref={bottomSheetRef}
            jobs={candidateJobs}
            currentSelectedJob={currentSelectedJob}
            onPressCard={onChangeSelectedJobHandler}
            onReachEnd={loadMore}
            onRefresh={() => getJobPostsHandler(true)}
            isRefreshing={isRefreshing}
          />
        </OnBoardingBackground>
      </CandidateListActionsBottomSheetContextProvider>
    </UserDetailsViewSheetCandidateListProvider>
  );
};

export default CandidateList;

const getStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollMain: {
      flexGrow: 1,
    },
    mainView: {
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
      backgroundColor: '#fff',
    },
    screen: {
      width: windowWidth,
      height: '100%',
    },
    flexMain: {
      height: '100%',
    },
    flex: {
      flexGrow: 1,

      paddingVertical: verticalScale(16),
    },
    main: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    emptyView: {
      flexGrow: 1,
    },
  });
  return styles;
};
