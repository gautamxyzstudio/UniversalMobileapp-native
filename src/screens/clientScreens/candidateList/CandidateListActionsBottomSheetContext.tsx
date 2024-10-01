import {useUpdateJobApplicationStatusMutation} from '@api/features/client/clientApi';
import {restoreDeclinedCandidate} from '@api/features/client/clientSlice';
import {ICandidateTypes} from '@api/features/client/types';
import {IC_BLOCK, IC_DENY, IC_REMOVE, IC_RESTORE} from '@assets/exporter';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {IJobPostStatus} from '@utils/enums';
import {verticalScale} from '@utils/metrics';
import React, {createContext, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {STRINGS} from 'src/locales/english';

type ICandidateListActionsBottomSheetContextTypes = {
  onPressSheet: (
    option: 'show' | 'hide',
    jobId: number,
    type: 'shortlisted' | 'deny',
    candidateDetails: ICandidateTypes,
  ) => void;
  candidateDetails?: ICandidateTypes | null;
};

const CandidateListActionsBottomSheetContext =
  createContext<ICandidateListActionsBottomSheetContextTypes | null>(null);

const CandidateListActionsBottomSheetContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const compRef = useRef<BottomSheetModalMethods | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidateTypes>();
  const toast = useToast();
  const [statusUpdater] = useUpdateJobApplicationStatusMutation();
  const [currentJobId, updateCurrentJobId] = useState<number>(0);
  const optionSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const {insetsBottom} = useScreenInsets();
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState<'shortlisted' | 'deny'>(
    'shortlisted',
  );
  const sheetPressHandler = (
    option: 'show' | 'hide',
    jobId: number,
    type: 'shortlisted' | 'deny',
    candidateDetails: ICandidateTypes,
  ) => {
    if (candidateDetails) {
      setSelectedCandidate(candidateDetails);
      setViewType(type);
      updateCurrentJobId(jobId);
    }
    if (option === 'show') {
      compRef.current?.snapToIndex(1);
    } else {
      compRef.current?.snapToIndex(0);
    }
  };

  const contextValue: ICandidateListActionsBottomSheetContextTypes = {
    onPressSheet: sheetPressHandler,
    candidateDetails: null,
  };

  const restoreCandidateHandler = () =>
    withAsyncErrorHandlingPost(
      async () => {
        if (selectedCandidate && currentJobId) {
          optionSheetRef.current?.close();
          const response = await statusUpdater({
            applicationId: selectedCandidate.id,
            status: IJobPostStatus.APPLIED,
          }).unwrap();
          if (response) {
            dispatch(
              restoreDeclinedCandidate({
                applicant: selectedCandidate,
                jobId: currentJobId,
              }),
            );
          }
        }
      },
      toast,
      dispatch,
    );

  const onPressBlock = () => {
    optionSheetRef.current?.close();
    setTimeout(() => {
      Alert.alert('feature not implemented');
    }, 300);
  };

  return (
    <CandidateListActionsBottomSheetContext.Provider value={contextValue}>
      {children}
      <SelectOptionBottomSheet
        modalHeight={
          verticalScale(viewType === 'deny' ? 208 : 280) + insetsBottom
        }
        ref={optionSheetRef}
        options={
          viewType === 'deny'
            ? [
                {
                  icon: IC_RESTORE,
                  title: STRINGS.remove_from_shortlist,
                  onPress: restoreCandidateHandler(),
                },
                {
                  icon: IC_BLOCK,
                  title: STRINGS.block,
                  onPress: () => onPressBlock(),
                },
              ]
            : [
                {
                  icon: IC_REMOVE,
                  title: STRINGS.remove_from_shortlist,
                  onPress: () => console.log('hello wrold'),
                },
                {
                  icon: IC_DENY,
                  title: STRINGS.deny,
                  onPress: () => console.log('hello wrold'),
                },
                {
                  icon: IC_BLOCK,
                  title: STRINGS.block,
                  onPress: () => onPressBlock(),
                },
              ]
        }
      />
    </CandidateListActionsBottomSheetContext.Provider>
  );
};

export const useCandidateListActionsBottomSheetContext = () => {
  const context = React.useContext(CandidateListActionsBottomSheetContext);
  if (!context) {
    throw new Error(
      'useCandidateListActionsBottomSheetContext must be used within a CandidateListActionsBottomSheetContextProvider ',
    );
  }
  return context;
};
export default CandidateListActionsBottomSheetContextProvider;
