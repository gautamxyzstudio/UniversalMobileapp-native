import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import JobPostCard from '@components/client/JobPostCard';
import {IJobTypesEnum} from '@utils/enums';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';
import {
  BIN,
  BIN_SECONDARY,
  DELETE_SECONDARY,
  IC_DOCUMENT,
  PENCIL,
  POST,
} from '@assets/exporter';
import {useLazyGetDraftsQuery} from '@api/features/client/clientApi';
import CustomList from '@components/molecules/customList';
import {IJobPostTypes} from '@api/features/client/types';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '@api/features/loading/loadingSlice';
import JobPostCardLoading from '@components/client/JobPostCardLoading';
import {
  addNewDraft,
  jobDraftFromState,
  saveDrafts,
} from '@api/features/client/clientSlice';
import {mockJobPosts} from '@api/mockData';

const JobPostDrafts = () => {
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);
  const rootDrafts = useSelector(jobDraftFromState);
  const [drafts, setDrafts] = useState<IJobPostTypes[]>([]);
  const dispatch = useDispatch();
  const [getDrafts, {isFetching}] = useLazyGetDraftsQuery();

  useEffect(() => {
    setDrafts(rootDrafts);
  }, [rootDrafts]);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const onPressDraftCard = () => {
    quickActionSheetRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    dispatch(setLoading(isFetching));
  }, []);

  const fetchDrafts = async () => {
    try {
      const posts = await getDrafts(null).unwrap();
      if (posts) {
        dispatch(saveDrafts(posts.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) => {
      if (isFetching) {
        return <JobPostCardLoading isDraft />;
      } else {
        return <JobPostCard isDraft onPress={onPressDraftCard} {...item} />;
      }
    },
    [isFetching],
  );

  return (
    <OnBoardingBackground title={STRINGS.draft}>
      <CustomList
        data={isFetching ? mockJobPosts : drafts}
        estimatedItemSize={verticalScale(130)}
        renderItem={renderItem}
        error={undefined}
        isLastPage={true}
      />
      {/* <CustomList  /> */}
      <SelectOptionBottomSheet
        ref={quickActionSheetRef}
        customStyles={styles.container}
        headerTitle={STRINGS.quick_links}
        modalHeight={verticalScale(420)}
        options={[
          {
            icon: POST,
            title: STRINGS.post,
            onPress: () => console.log('void'),
          },
          {
            icon: PENCIL,
            title: STRINGS.edit,
            onPress: () => console.log('void'),
          },
          {
            icon: IC_DOCUMENT,
            title: STRINGS.viewDetails,
            onPress: () => console.log('void'),
          },
          {
            icon: BIN_SECONDARY,
            title: STRINGS.delete,
            onPress: () => console.log('void'),
          },
        ]}
      />
    </OnBoardingBackground>
  );
};

export default JobPostDrafts;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: verticalScale(24),
    paddingVertical: verticalScale(24),
  },
});
