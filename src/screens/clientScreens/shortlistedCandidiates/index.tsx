/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, TextInput, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useNavigation} from '@react-navigation/native';
import ShortlistedCandidateCard from '@components/client/ShortlistedCandidateCard';
import {useLazyGetCandidatesListQuery} from '@api/features/client/clientApi';
import {IGetShortlistedCandidatesParams} from './types';
import {useDispatch} from 'react-redux';
import {updateShortlistedApplication} from '@api/features/client/clientSlice';
import {SEARCH} from '@assets/exporter';
import CandidateListTopView from '@components/client/CandidateListTopView';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {createStyles} from './styles';

const ShortListedCandidates: React.FC<IGetShortlistedCandidatesParams> = ({
  route,
}) => {
  const [search, setSearch] = useState('');
  const searchRef = useRef<TextInput | null>(null);
  const navigation = useNavigation();
  const styles = useThemeAwareObject(createStyles);
  const dispatch = useDispatch();
  const jobId = route?.params?.jobId;

  const [getShortlistedCandidates, {isFetching, isError}] =
    useLazyGetCandidatesListQuery();

  const getApplications = async (jId: number) => {
    if (jobId) {
      try {
        const applicants = await getShortlistedCandidates({
          type: 'shortlisted',
          jobId: jId,
        }).unwrap();
        if (applicants) {
          dispatch(
            updateShortlistedApplication({
              jobId,
              candidates: applicants,
              pageNumber: 1,
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getApplications(jobId);
  }, [jobId]);

  const onChangeSearch = (e: string) => {
    setSearch(e);
  };

  const onPresCrossSearch = () => {
    setSearch('');
  };

  const onPressDone = () => {
    console.log(search);
  };

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
        jobName={'SOFTWARE'}
        jobId={0}
        creationDate={new Date()}
        withSwitch={false}
        withSegmentView={false}
      />

      <View>
        <ShortlistedCandidateCard />
      </View>
    </OnBoardingBackground>
  );
};

export default ShortListedCandidates;

const styles = StyleSheet.create({});
