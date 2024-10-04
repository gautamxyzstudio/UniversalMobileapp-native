import {useUpdateJobApplicationStatusMutation} from '@api/features/client/clientApi';
import {
  declineShortlistedCandidate,
  removeFromShortlisted,
  restoreDeclinedCandidate,
} from '@api/features/client/clientSlice';
import {ICandidateTypes} from '@api/features/client/types';
import {setLoading} from '@api/features/loading/loadingSlice';
import {ICustomErrorResponse} from '@api/types';
import {IC_BLOCK, IC_DENY, IC_REMOVE, IC_RESTORE} from '@assets/exporter';
import {showToast} from '@components/organisms/customToast';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {IJobPostStatus} from '@utils/enums';
import {verticalScale} from '@utils/metrics';
import React, {createContext, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {timeOutTimeSheets} from 'src/constants/constants';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {STRINGS} from 'src/locales/english';

type ICandidateListActionsBottomSheetContextTypes = {
  onPressThreeDots: (
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
    console.log(candidateDetails, option, jobId, type);
    if (candidateDetails) {
      setSelectedCandidate(candidateDetails);
      setViewType(type);
      updateCurrentJobId(jobId);
    }
    if (option === 'show') {
      optionSheetRef.current?.snapToIndex(1);
    } else {
      optionSheetRef.current?.snapToIndex(0);
    }
  };

  const contextValue: ICandidateListActionsBottomSheetContextTypes = {
    onPressThreeDots: sheetPressHandler,
    candidateDetails: null,
  };

  const onPressSheetAction = (type: number) => {
    optionSheetRef.current?.close();
    setTimeout(() => {
      switch (type) {
        case 0:
          restoreCandidateHandler();
          break;
        case 1:
          onPressBlock();
          break;
        case 2:
          removeFromShortlistHandler();
          break;
        case 3:
          declineShortlistedCandidateHandler();
          break;
        case 4:
          onPressBlock();
          break;
        default:
          Alert.alert('Invalid option selected');
          break;
      }
    }, timeOutTimeSheets);
  };

  const restoreCandidateHandler = async () => {
    try {
      dispatch(setLoading(true));
      if (selectedCandidate && currentJobId) {
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
    } catch (err) {
      let customError = err as ICustomErrorResponse;
      showToast(
        toast,
        customError?.message ?? STRINGS.someting_went_wrong,
        'error',
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onPressBlock = () => {
    optionSheetRef.current?.close();
    setTimeout(() => {
      Alert.alert('feature not implemented');
    }, timeOutTimeSheets);
  };

  const removeFromShortlistHandler = async () => {
    try {
      dispatch(setLoading(true));
      if (selectedCandidate && currentJobId) {
        optionSheetRef.current?.close();
        const response = await statusUpdater({
          applicationId: selectedCandidate.id,
          status: IJobPostStatus.APPLIED,
        }).unwrap();
        if (response) {
          dispatch(
            removeFromShortlisted({
              applicant: selectedCandidate,
              jobId: currentJobId,
            }),
          );
        }
      }
    } catch (err) {
      let customError = err as ICustomErrorResponse;
      showToast(
        toast,
        customError?.message ?? STRINGS.someting_went_wrong,
        'error',
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  const declineShortlistedCandidateHandler = async () => {
    try {
      dispatch(setLoading(true));
      if (selectedCandidate && currentJobId) {
        optionSheetRef.current?.close();
        const response = await statusUpdater({
          applicationId: selectedCandidate.id,
          status: IJobPostStatus.DECLINED,
        }).unwrap();
        if (response) {
          dispatch(
            declineShortlistedCandidate({
              applicant: selectedCandidate,
              jobId: currentJobId,
            }),
          );
        }
      }
    } catch (err) {
      let customError = err as ICustomErrorResponse;
      showToast(
        toast,
        customError?.message ?? STRINGS.someting_went_wrong,
        'error',
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <CandidateListActionsBottomSheetContext.Provider value={contextValue}>
      {children}
      <SelectOptionBottomSheet
        modalHeight={
          viewType === 'deny'
            ? verticalScale(192) + insetsBottom
            : verticalScale(264) + insetsBottom
        }
        ref={optionSheetRef}
        options={
          viewType === 'deny'
            ? [
                {
                  icon: IC_RESTORE,
                  title: STRINGS.restore,
                  onPress: () => onPressSheetAction(0),
                },
                {
                  icon: IC_BLOCK,
                  title: STRINGS.block,
                  onPress: () => onPressSheetAction(1),
                },
              ]
            : [
                {
                  icon: IC_REMOVE,
                  title: STRINGS.remove_from_shortlist,
                  onPress: () => onPressSheetAction(2),
                },
                {
                  icon: IC_DENY,
                  title: STRINGS.deny,
                  onPress: () => onPressSheetAction(3),
                },
                {
                  icon: IC_BLOCK,
                  title: STRINGS.block,
                  onPress: () => onPressSheetAction(4),
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
