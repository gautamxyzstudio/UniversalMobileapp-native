import {useUpdateJobApplicationStatusMutation} from '@api/features/client/clientApi';
import {
  confirmCandidate,
  declineCandidate,
} from '@api/features/client/clientSlice';
import {ICandidateTypes} from '@api/features/client/types';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CandidateDetailsBottomSheet from '@screens/clientScreens/candidateList/CandidateDetailsBottomSheet';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {ICandidateStatusEnum, IJobPostStatus} from '@utils/enums';
import React, {createContext, useRef, useState} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {timeOutTimeSheets} from 'src/constants/constants';

type IUserDetailsViewCandidatesContextTypes = {
  onPressSheet: (
    option: 'show' | 'hide',
    type: 'applications' | 'shortlisted' | 'deny',
    candidateDetails: ICandidateTypes,
    jobId: number,
  ) => void;
  candidateDetails?: ICandidateTypes | null;
};

const userDetailsViewCandidateListContext =
  createContext<IUserDetailsViewCandidatesContextTypes | null>(null);

const UserDetailsViewSheetCandidateListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const compRef = useRef<BottomSheetModalMethods | null>(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidateTypes>();
  const [currentJobId, updateCurrentJobId] = useState<number>(0);
  const [statusUpdater] = useUpdateJobApplicationStatusMutation();
  const [viewType, setViewType] = useState<
    'applications' | 'shortlisted' | 'deny'
  >('applications');
  const sheetPressHandler = (
    option: 'show' | 'hide',
    type: 'applications' | 'shortlisted' | 'deny',
    candidateDetails: ICandidateTypes,
    jobId: number,
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

  const contextValue: IUserDetailsViewCandidatesContextTypes = {
    onPressSheet: sheetPressHandler,
    candidateDetails: null,
  };

  const acceptCandidateApplication = () =>
    withAsyncErrorHandlingPost(
      async () => {
        compRef.current?.snapToIndex(0);
        setTimeout(async () => {
          if (selectedCandidate) {
            const response = await statusUpdater({
              applicationId: selectedCandidate.id,
              status: IJobPostStatus.CONFIRMED,
            }).unwrap();
            if (response) {
              if (currentJobId) {
                dispatch(
                  confirmCandidate({
                    applicant: selectedCandidate,
                    jobId: currentJobId,
                  }),
                );
                console.log(response, 'confirm');
              }
            }
          }
        }, timeOutTimeSheets);
      },
      toast,
      dispatch,
    );

  const declineCandidateApplication = () =>
    withAsyncErrorHandlingPost(
      async () => {
        compRef.current?.snapToIndex(0);
        setTimeout(async () => {
          if (selectedCandidate) {
            const response = await statusUpdater({
              applicationId: selectedCandidate.id,
              status: IJobPostStatus.DECLINED,
            }).unwrap();
            if (response) {
              if (currentJobId) {
                dispatch(
                  declineCandidate({
                    applicant: selectedCandidate,
                    jobId: currentJobId,
                  }),
                );
                console.log(response);
              }
            }
          }
        }, timeOutTimeSheets);
      },
      toast,
      dispatch,
    );

  return (
    <userDetailsViewCandidateListContext.Provider value={contextValue}>
      {children}
      <CandidateDetailsBottomSheet
        ref={compRef}
        details={selectedCandidate}
        jobStatus={getJobStatus(viewType)}
        onPressApprove={acceptCandidateApplication}
        onPressDecline={declineCandidateApplication}
      />
    </userDetailsViewCandidateListContext.Provider>
  );
};

export const useUserDetailsViewCandidateListContext = () => {
  const context = React.useContext(userDetailsViewCandidateListContext);
  if (!context) {
    throw new Error(
      'useUserDetailsViewCandidateListContext must be used within a UserDetailsViewSheetCandidateListProvider ',
    );
  }
  return context;
};
export default UserDetailsViewSheetCandidateListProvider;

const getJobStatus = (type: 'applications' | 'shortlisted' | 'deny') => {
  if (type === 'applications') {
    return ICandidateStatusEnum.pending;
  } else if (type === 'shortlisted') {
    return ICandidateStatusEnum.selected;
  } else {
    return ICandidateStatusEnum.declined;
  }
};
