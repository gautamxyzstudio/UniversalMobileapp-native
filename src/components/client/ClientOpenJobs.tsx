import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {mockJobPostsLoading} from '@api/mockData';
import JobPostCard from './JobPostCard';
import JobPostCardLoading from './JobPostCardLoading';
import CustomList from '@components/molecules/customList';
import {verticalScale} from '@utils/metrics';
import {useLazyGetPostedJobQuery} from '@api/features/client/clientApi';
import {IJobPostTypes} from '@api/features/client/types';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  BIN_SECONDARY,
  CHECK_IN,
  IC_DOCUMENT,
  PAUSE,
  PERSON_SECONDARY,
} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';

const ClientOpenJobs = () => {
  const [getJobPosts, {isLoading, data}] = useLazyGetPostedJobQuery();
  const [jobPosts, updateJobPosts] = useState<IJobPostTypes[]>([]);
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);

  useEffect(() => {
    getJobPostsHandler();
  }, []);

  const onPressCard = () => {
    quickActionSheetRef.current?.snapToIndex(1);
  };

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) =>
      isLoading ? (
        <JobPostCardLoading />
      ) : (
        <JobPostCard onPress={onPressCard} {...item} />
      ),
    [isLoading, data],
  );

  const getJobPostsHandler = async () => {
    try {
      const response = await getJobPosts(null).unwrap();
      if (response.data) updateJobPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CustomList
        data={isLoading ? mockJobPostsLoading : jobPosts}
        estimatedItemSize={verticalScale(220)}
        renderItem={renderItem}
        error={undefined}
        getItemType={item => item.id}
        onRefresh={getJobPostsHandler}
        ListFooterComponentStyle={{height: verticalScale(150)}}
        isLastPage={true}
      />

      <SelectOptionBottomSheet
        ref={quickActionSheetRef}
        customStyles={styles.container}
        headerTitle={STRINGS.quick_links}
        modalHeight={verticalScale(420)}
        options={[
          {
            icon: CHECK_IN,
            title: STRINGS.check_in,
            onPress: () => console.log('void'),
          },
          {
            icon: PERSON_SECONDARY,
            title: STRINGS.view_applicants,
            onPress: () => console.log('void'),
          },
          {
            icon: IC_DOCUMENT,
            title: STRINGS.viewDetails,
            onPress: () => console.log('void'),
          },
          {
            icon: PAUSE,
            title: STRINGS.stop,
            onPress: () => console.log('void'),
          },
        ]}
      />
    </>
  );
};

export default ClientOpenJobs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: verticalScale(24),
    paddingVertical: verticalScale(24),
  },
});
