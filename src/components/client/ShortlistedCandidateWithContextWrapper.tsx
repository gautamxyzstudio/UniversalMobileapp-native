import React from 'react';
import UserDetailsViewSheetCandidateListProvider from '@screens/clientScreens/candidateList/UserDetailsViewCandidateList';
import ShortListedCandidates from '@screens/clientScreens/shortlistedCandidiates';

type IGetShortlistedCandidatesParams = {
  route: {
    params: {
      jobId: number;
      createdAt: Date;
      name: string;
    };
  };
};

const ShortlistedCandidateWithContextWrapper: React.FC<
  IGetShortlistedCandidatesParams
> = ({route}) => {
  return (
    <UserDetailsViewSheetCandidateListProvider>
      <ShortListedCandidates route={route} />
    </UserDetailsViewSheetCandidateListProvider>
  );
};

export default ShortlistedCandidateWithContextWrapper;
