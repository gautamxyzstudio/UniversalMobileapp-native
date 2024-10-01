import {ICandidateTypes} from '@api/features/client/types';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CandidateDetailsBottomSheet from '@screens/clientScreens/candidateList/CandidateDetailsBottomSheet';
import {ICandidateStatusEnum} from '@utils/enums';
import React, {createContext, useRef, useState} from 'react';

type IUserDetailsViewCandidatesContextTypes = {
  onPressSheet: (
    option: 'show' | 'hide',
    type: 'applications' | 'shortlisted' | 'deny',
    candidateDetails: ICandidateTypes,
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
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidateTypes>();
  const [viewType, setViewType] = useState<
    'applications' | 'shortlisted' | 'deny'
  >('applications');
  const sheetPressHandler = (
    option: 'show' | 'hide',
    type: 'applications' | 'shortlisted' | 'deny',
    candidateDetails: ICandidateTypes,
  ) => {
    if (candidateDetails) {
      setSelectedCandidate(candidateDetails);
      setViewType(type);
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

  console.log(viewType);
  return (
    <userDetailsViewCandidateListContext.Provider value={contextValue}>
      {children}
      <CandidateDetailsBottomSheet
        ref={compRef}
        details={selectedCandidate}
        jobStatus={getJobStatus(viewType)}
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
