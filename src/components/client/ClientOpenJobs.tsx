/* eslint-disable react-hooks/exhaustive-deps */
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
import {CHECK_IN, IC_DOCUMENT, PAUSE, PERSON_SECONDARY} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';
import {useDispatch, useSelector} from 'react-redux';
import {
  openJobsFromState,
  saveOpenJobs,
} from '@api/features/client/clientSlice';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';

const ClientOpenJobs = () => {
  const [getJobPosts, {isLoading, error}] = useLazyGetPostedJobQuery();
  const openJobs = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(userBasicDetailsFromState);
  const [jobPosts, updateJobPosts] = useState<IJobPostTypes[]>([]);
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);

  useEffect(() => {
    getJobPostsHandler();
  }, []);

  const onPressCard = () => {
    quickActionSheetRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    updateJobPosts(openJobs);
  }, [openJobs]);

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) =>
      isLoading ? (
        <JobPostCardLoading />
      ) : (
        <JobPostCard onPress={onPressCard} {...item} />
      ),
    [isLoading, jobPosts],
  );

  const getJobPostsHandler = withAsyncErrorHandlingPost(
    async () => {
      const response = await getJobPosts(user?.details?.detailsId).unwrap();
      if (response.data) {
        dispatch(saveOpenJobs(response.data));
      }
    },
    toast,
    dispatch,
  );

  return (
    <>
      <CustomList
        data={isLoading ? mockJobPostsLoading : jobPosts}
        estimatedItemSize={verticalScale(220)}
        renderItem={renderItem}
        error={error}
        getItemType={item => item.id}
        emptyListMessage={STRINGS.no_jobs_posted_yet}
        emptyListSubTitle={STRINGS.create_job_to_find}
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
