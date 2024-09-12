import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import JobPostCard from '@components/client/JobPostCard';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';
import {BIN, BIN_SECONDARY, IC_DOCUMENT, PENCIL, POST} from '@assets/exporter';
import {
  useDeleteADraftMutation,
  useLazyGetDraftsQuery,
  usePostAJobMutation,
} from '@api/features/client/clientApi';
import CustomList from '@components/molecules/customList';
import {IJobPostTypes} from '@api/features/client/types';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '@api/features/loading/loadingSlice';
import JobPostCardLoading from '@components/client/JobPostCardLoading';
import {
  addNewDraft,
  addNewJob,
  jobDraftFromState,
  removeADraft,
  saveDrafts,
} from '@api/features/client/clientSlice';
import {mockJobPosts} from '@api/mockData';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';
import EmptyState from '@screens/common/emptyAndErrorScreen';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {IJobPostStatus} from '@utils/enums';

const JobPostDrafts = () => {
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);
  const jobDetailsSheetRef = useRef<BottomSheetModal | null>(null);
  const rootDrafts = useSelector(jobDraftFromState);

  const [currentSelectedDraft, setCurrentSelectedDraft] =
    useState<IJobPostTypes | null>(null);
  const [drafts, setDrafts] = useState<IJobPostTypes[]>([]);
  const dispatch = useDispatch();
  const [getDrafts, {isFetching, error}] = useLazyGetDraftsQuery();
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();
  const user = useSelector(userBasicDetailsFromState);
  const [postJob] = usePostAJobMutation();
  const [deleteDrafts] = useDeleteADraftMutation();

  useEffect(() => {
    setDrafts(rootDrafts);
  }, [rootDrafts]);

  useEffect(() => {
    fetchDrafts();
  }, []); // Empty dependency array ensures this only runs once

  const fetchDrafts = async () => {
    try {
      const posts = await getDrafts(null).unwrap();
      if (posts.data) {
        dispatch(saveDrafts(posts.data));
      }
    } catch (e) {
      console.error('Error fetching drafts:', e);
    }
  };

  const onPressDraftCard = (draft: IJobPostTypes) => {
    setCurrentSelectedDraft(draft);
    quickActionSheetRef.current?.snapToIndex(1);
  };

  const postJobHandler = async () => {
    quickActionSheetRef.current?.close();
    setTimeout(async () => {
      try {
        dispatch(setLoading(true));
        if (currentSelectedDraft !== null) {
          const response = await postJob({
            data: {
              job_name: currentSelectedDraft.job_name ?? '',
              client_details: user?.details?.detailsId ?? 0,
              status: IJobPostStatus.OPEN,
              jobDuties: currentSelectedDraft.jobDuties,
              description: currentSelectedDraft.description,
              job_type: currentSelectedDraft.job_type,
              eventDate: currentSelectedDraft.eventDate,
              startShift: currentSelectedDraft.startShift,
              endShift: currentSelectedDraft.endShift,
              location: currentSelectedDraft.location,
              city: currentSelectedDraft.city,
              address: currentSelectedDraft.address,
              postalCode: currentSelectedDraft.postalCode,
              gender: currentSelectedDraft.gender,
              salary: currentSelectedDraft.salary,
              requiredEmployee: currentSelectedDraft.requiredEmployee,
              required_certificates:
                currentSelectedDraft.required_certificates ?? [],
            },
          }).unwrap();
          if (response) {
            const deletePostedDraftResponse = await deleteDrafts({
              id: currentSelectedDraft?.id ?? 0,
            }).unwrap();
            if (deletePostedDraftResponse) {
              dispatch(addNewJob(response));
              dispatch(removeADraft({id: currentSelectedDraft?.id ?? 0}));
            }
            showToast(toast, 'job posted successfully', 'success');
            navigation.navigate('clientTabBar');
          }
        }
      } catch (error) {
        console.log(error, 'error');
        showToast(toast, STRINGS.someting_went_wrong, 'error');
      } finally {
        dispatch(setLoading(false));
      }
    }, 300);
  };

  const onPressJobDetails = () => {
    quickActionSheetRef.current?.close();
    setTimeout(() => {
      jobDetailsSheetRef.current?.snapToIndex(1);
    }, 300);
  };

  const onPressDeleteDraft = () => {
    quickActionSheetRef.current?.close();
    setTimeout(async () => {
      try {
        dispatch(setLoading(true));
        const response = await deleteDrafts({
          id: currentSelectedDraft?.id ?? 0,
        }).unwrap();
        if (response) {
          dispatch(removeADraft({id: currentSelectedDraft?.id ?? 0}));
          showToast(toast, STRINGS.draft_deleted_successful, 'success');
        }
      } catch (error) {
        showToast(toast, STRINGS.someting_went_wrong, 'error');
        console.error('Error deleting draft:', error);
      } finally {
        dispatch(setLoading(false));
      }
    }, 300);
  };

  const onPressEditDraft = () => {
    quickActionSheetRef.current?.close();
    setTimeout(async () => {
      navigation.navigate('jobPosting', {
        draftId: currentSelectedDraft?.id ?? 0,
      });
    }, 300);
  };

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) =>
      isFetching ? (
        <JobPostCardLoading isDraft />
      ) : (
        <JobPostCard isDraft onPress={() => onPressDraftCard(item)} {...item} />
      ),
    [isFetching],
  );

  return (
    <OnBoardingBackground title={STRINGS.draft}>
      <CustomList
        data={isFetching ? mockJobPosts : drafts}
        estimatedItemSize={verticalScale(130)}
        renderItem={renderItem}
        emptyListMessage={STRINGS.emptyTitleDrafts}
        emptyListSubTitle={STRINGS.emptySubTitleDrafts}
        error={error}
        isLastPage={true}
      />
      <SelectOptionBottomSheet
        ref={quickActionSheetRef}
        customStyles={styles.container}
        headerTitle={STRINGS.quick_links}
        modalHeight={verticalScale(420)}
        options={[
          {
            icon: POST,
            title: STRINGS.post,
            onPress: postJobHandler,
          },
          {
            icon: PENCIL,
            title: STRINGS.edit,
            onPress: onPressEditDraft,
          },
          {
            icon: IC_DOCUMENT,
            title: STRINGS.viewDetails,
            onPress: onPressJobDetails,
          },
          {
            icon: BIN_SECONDARY,
            title: STRINGS.delete,
            onPress: onPressDeleteDraft,
          },
        ]}
      />
      <JobDetailsBottomSheet
        ref={jobDetailsSheetRef}
        jobDetails={currentSelectedDraft}
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
