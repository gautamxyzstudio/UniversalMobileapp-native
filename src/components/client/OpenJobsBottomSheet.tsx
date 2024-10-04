/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useNavigation} from '@react-navigation/native';
import {STRINGS} from 'src/locales/english';
import {verticalScale, windowHeight} from '@utils/metrics';
import OpenJobsListCard from './OpenJobsListCard';
import {ICandidateListTypes} from '@api/features/client/types';
import Spacers from '@components/atoms/Spacers';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import BottomButtonView from '@components/organisms/bottomButtonView';
import _ from 'lodash';

type IOpenJobsBottomSheetPropsTypes = {
  jobs: ICandidateListTypes[];
  currentSelectedJob: ICandidateListTypes | null;
  onPressCard: (job: ICandidateListTypes) => void;
  onReachEnd: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

const OpenJobsBottomSheet = React.forwardRef<
  BottomSheetModal,
  IOpenJobsBottomSheetPropsTypes
>(
  (
    {
      jobs,
      currentSelectedJob,
      onPressCard,
      isRefreshing,
      onReachEnd,
      onRefresh,
    },
    ref,
  ) => {
    const [search, setSearch] = useState('');
    const [currentJobs, setCurrentJobs] = useState(jobs);
    const [selectedJob, setSelectedJob] =
      useState<ICandidateListTypes | null>();
    const keyboardHeight = useKeyboardHeight();
    const modalHeight = windowHeight / 1.5;
    const snapPoints = useMemo(
      () => [0.01, modalHeight, modalHeight + keyboardHeight / 2],
      [modalHeight, keyboardHeight],
    );

    const handleSearch = useCallback(
      _.debounce(query => {
        if (!query) {
          setCurrentJobs(jobs);
        } else {
          const filteredJobs = jobs.filter(
            job =>
              job.details.jobName.toLowerCase().includes(query.toLowerCase()) ||
              job.details.jobId
                .toString()
                .toLowerCase()
                .includes(query.toLowerCase()),
          );
          setCurrentJobs(filteredJobs);
        }
      }, 100),
      [jobs],
    );

    useEffect(() => {
      handleSearch(search);
    }, [search, handleSearch]);

    useEffect(() => {
      setSelectedJob(currentSelectedJob);
    }, [currentSelectedJob]);

    useEffect(() => {
      setCurrentJobs(jobs);
    }, [jobs]);

    const onPresCrossSearch = () => {
      setSearch('');
    };

    const onClose = () => {
      //@ts-ignore
      ref.current?.snapToIndex(0);
    };
    const navigation = useNavigation();

    const onPressSelect = () => {
      if (selectedJob) {
        onPressCard(selectedJob);
      }
    };

    const renderItem = useCallback(
      ({item}: {item: ICandidateListTypes}) => (
        <OpenJobsListCard
          isSelected={selectedJob?.details.jobId === item.details.jobId}
          onPressCard={() => setSelectedJob(item)}
          job={item}
        />
      ),
      [currentJobs, selectedJob],
    );

    const itemSeparatorComponent = useCallback(
      () => <View style={styles.spacer} />,
      [],
    );

    return (
      <BaseBottomSheet ref={ref} snapPoints={snapPoints} onClose={onClose}>
        <SearchInput
          value={search}
          onChangeText={e => setSearch(e)}
          innerContainerStyle={styles.searchOuter}
          containerStyles={styles.searchInner}
          onPressCross={onPresCrossSearch}
          placeHolder={STRINGS.search}
          withBack={false}
          navigation={navigation}
        />
        <Spacers type="vertical" size={20} scalable />
        <BottomSheetFlatList
          data={currentJobs}
          ItemSeparatorComponent={itemSeparatorComponent}
          ListFooterComponent={<View />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View>
              <Text>{STRINGS.no_jobs_found}</Text>
            </View>
          }
          ListFooterComponentStyle={styles.footer}
          onRefresh={onRefresh}
          onEndReached={onReachEnd}
          refreshing={isRefreshing}
          onEndReachedThreshold={0.2}
          renderItem={renderItem}
        />
        <BottomButtonView
          disabled={
            selectedJob !== undefined &&
            currentSelectedJob !== undefined &&
            selectedJob?.details.jobId === currentSelectedJob?.details.jobId
          }
          title={STRINGS.done}
          onButtonPress={onPressSelect}
        />
      </BaseBottomSheet>
    );
  },
);

export default OpenJobsBottomSheet;

const styles = StyleSheet.create({
  searchOuter: {borderRadius: 4, height: verticalScale(40)},
  searchInner: {height: verticalScale(40)},
  scrollView: {
    gap: verticalScale(12),
    paddingHorizontal: verticalScale(1),
    paddingTop: verticalScale(4),
  },
  spacer: {
    height: verticalScale(12),
  },
  footer: {
    height: verticalScale(24),
  },
});
