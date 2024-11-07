/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import {useNavigation} from '@react-navigation/native';
import ShortlistedCandidateCard from '@components/client/ShortlistedCandidateCard';
import {useLazyGetCandidatesListQuery} from '@api/features/client/clientApi';
import {IGetShortlistedCandidatesParams} from './types';
import {useDispatch} from 'react-redux';
import {IC_NO_SHORTLISTED, SEARCH} from '@assets/exporter';
import CandidateListTopView from '@components/client/CandidateListTopView';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {createStyles} from './styles';
import ShortlistedCandidateLoadingCard from '@components/client/ShortlistedCandidateLoadingCard';
import {mockJobPostsLoading} from '@api/mockData';
import {ICandidateTypes} from '@api/features/client/types';
import CustomList from '@components/molecules/customList';

const ShortListedCandidates: React.FC<IGetShortlistedCandidatesParams> = ({
  route,
}) => {
  const navigation = useNavigation();
  const styles = useThemeAwareObject(createStyles);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [shortlistedCandidates, updateShortlistedCandidates] = useState<
    ICandidateTypes[]
  >([]);
  const jobId = route?.params?.jobId;
  const jobName = route?.params?.name;
  const createdAt = route?.params?.createdAt;

  const [getShortlistedCandidates, {isFetching, error}] =
    useLazyGetCandidatesListQuery();

  const getApplications = async (jId: number) => {
    if (jobId) {
      try {
        const applicants = await getShortlistedCandidates({
          type: 'shortlisted',
          jobId: jId,
        }).unwrap();
        if (applicants) {
          updateShortlistedCandidates(applicants);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getApplications(jobId);
  };

  useEffect(() => {
    getApplications(jobId);
  }, [jobId]);

  const renderItem = useCallback(() => {
    return <ShortlistedCandidateCard />;
  }, [shortlistedCandidates]);
  const renderItemLoading = useCallback(() => {
    return <ShortlistedCandidateLoadingCard />;
  }, [shortlistedCandidates]);

  return (
    <OnBoardingBackground
      isInlineTitle
      displayRightIcon
      childrenStyles={styles.container}
      rightIcon={SEARCH}
      isSearch
      // rightIconPressHandler={}
      title={STRINGS.check_in}>
      <CandidateListTopView
        jobName={jobName}
        jobId={jobId}
        creationDate={createdAt}
        withSwitch={false}
        withSegmentView={false}
      />
      <View style={styles.mainView}>
        <CustomList
          contentContainerStyle={styles.list}
          estimatedItemSize={196}
          onRefresh={onRefresh}
          refreshing
          data={isFetching ? mockJobPostsLoading : shortlistedCandidates}
          renderItem={isFetching ? renderItemLoading : renderItem}
          emptyListMessage={STRINGS.no_shortlisted}
          emptyListIllustration={IC_NO_SHORTLISTED}
          emptyListSubTitle={STRINGS.please_review}
          error={error}
          isLastPage={true}
        />
      </View>
    </OnBoardingBackground>
  );
};

export default ShortListedCandidates;

const styles = StyleSheet.create({});
