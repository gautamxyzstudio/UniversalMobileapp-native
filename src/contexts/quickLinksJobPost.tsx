import {IJobPostTypes} from '@api/features/client/types';
import {CHECK_IN, PERSON_SECONDARY, IC_DOCUMENT, PAUSE} from '@assets/exporter';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {verticalScale} from '@utils/metrics';
import React, {createContext, useRef, useState} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {STRINGS} from 'src/locales/english';
import {clientTabBarRoutes} from 'src/navigator/types';
import {useJobDetailsContext} from './displayJobDetailsContext';
import {useStopAJobPostMutation} from '@api/features/client/clientApi';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useDispatch} from 'react-redux';
import {stopAJobPostReducer} from '@api/features/client/clientSlice';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';

type IQuickLinksJobPostContextTypes = {
  onPressSheet: (
    option: 'show' | 'hide',
    type: 'open' | 'closed',
    JobDetails?: IJobPostTypes | null,
  ) => void;
  jobDetails: IJobPostTypes | null;
};

const quickLinksJobPostContext =
  createContext<IQuickLinksJobPostContextTypes | null>(null);

const QuickLinksJobPostContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedJobPost, updateSelectedJobPost] =
    useState<IJobPostTypes | null>(null);
  const [jobTypes, setJobTypes] = useState<'open' | 'closed'>('open');
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);
  const [stopAJobPost] = useStopAJobPostMutation();
  const {insetsBottom} = useScreenInsets();
  const navigation = useNavigation<any>();
  const toast = useToast();
  const {onPressSheet} = useJobDetailsContext();
  const dispatch = useDispatch();

  const sheetPressHandler = (
    option: 'show' | 'hide',
    type: 'open' | 'closed',
    JobDetails?: IJobPostTypes | null,
  ) => {
    if (JobDetails) {
      updateSelectedJobPost(JobDetails);
      setJobTypes(type);
    }
    if (option === 'show') {
      quickActionSheetRef.current?.snapToIndex(1);
    } else {
      quickActionSheetRef.current?.snapToIndex(0);
    }
  };

  const stopAJobHandler = (jobPost: IJobPostTypes) =>
    withAsyncErrorHandlingPost(
      async () => {
        quickActionSheetRef.current?.close();
        if (jobPost) {
          const response = await stopAJobPost({
            jobId: jobPost.id,
          }).unwrap();
          if (response) {
            if (jobPost) {
              dispatch(stopAJobPostReducer({jobId: jobPost.id}));
              showToast(toast, STRINGS.job_closed_success, 'success');
              console.log(response);
            }
          }
        }
      },
      toast,
      dispatch,
    );

  const onPressSheetAction = (type: number) => {
    quickActionSheetRef.current?.close();
    setTimeout(
      () => {
        switch (type) {
          case 0:
            navigation.navigate('shortlistedCandidates');
            break;
          case 1:
            navigation.navigate('clientTabBar', {
              screen: clientTabBarRoutes.contactList,
              params: {jobId: selectedJobPost?.id},
            });
            break;
          case 2:
            onPressSheet('show', selectedJobPost);
            break;
          case 3:
            if (selectedJobPost) {
              stopAJobHandler(selectedJobPost);
            }
            break;
          default:
            navigation.navigate('shortlistedCandidates');
            break;
        }
      },
      Platform.OS === 'android' ? 300 : 100,
    );
  };

  const contextValue: IQuickLinksJobPostContextTypes = {
    onPressSheet: sheetPressHandler,
    jobDetails: null,
  };

  return (
    <quickLinksJobPostContext.Provider value={contextValue}>
      {children}
      <SelectOptionBottomSheet
        ref={quickActionSheetRef}
        customStyles={styles.container}
        headerTitle={STRINGS.quick_links}
        modalHeight={verticalScale(400) + insetsBottom}
        options={
          jobTypes === 'open'
            ? [
                {
                  icon: CHECK_IN,
                  title: STRINGS.check_in,
                  onPress: () => onPressSheetAction(0),
                },
                {
                  icon: PERSON_SECONDARY,
                  title: STRINGS.viewApplicants,
                  onPress: () => onPressSheetAction(1),
                },
                {
                  icon: IC_DOCUMENT,
                  title: STRINGS.viewDetails,
                  onPress: () => onPressSheetAction(2),
                },
                {
                  icon: PAUSE,
                  title: STRINGS.stop,
                  onPress: () => () => onPressSheetAction(3),
                },
              ]
            : [
                {
                  icon: CHECK_IN,
                  title: STRINGS.check_in,
                  onPress: () => onPressSheetAction(0),
                },
                {
                  icon: IC_DOCUMENT,
                  title: STRINGS.viewDetails,
                  onPress: () => onPressSheetAction(2),
                },
              ]
        }
      />
    </quickLinksJobPostContext.Provider>
  );
};

export default QuickLinksJobPostContextProvider;

export const useQuickLinksJobPostContext = () => {
  const context = React.useContext(quickLinksJobPostContext);
  if (!context) {
    throw new Error(
      'useQuickLinksJobPostContext must be used within a QuickLinksJobPostContextProvider ',
    );
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: verticalScale(24),
    paddingVertical: verticalScale(24),
  },
});
