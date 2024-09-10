import React, {createContext, useRef, useState} from 'react';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import bottomSheetModal from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal';
import {IJobTypes} from '@api/types';

type IJobDetailsContextProviderProps = {
  onPressSheet: (
    option: 'show' | 'hide',
    JobDetails?: IJobTypes | null,
  ) => void;
  jobDetails: IJobTypes | null;
};

const JobDetailsContext = createContext<IJobDetailsContextProviderProps | null>(
  null,
);

const JobDetailsContextProvider = ({children}: {children: React.ReactNode}) => {
  const modalRef = useRef<bottomSheetModal | null>(null);
  const [selectedJobDetails, updateSelectedJobDetails] =
    useState<IJobTypes | null>(null);

  const sheetPressHandler = (
    option: 'show' | 'hide',
    JobDetails?: IJobTypes | null,
  ) => {
    if (option === 'show') {
      modalRef.current?.snapToIndex(1);
    } else {
      modalRef.current?.snapToIndex(0);
    }
    if (JobDetails) {
      updateSelectedJobDetails(JobDetails);
    }
  };

  const contextValue: IJobDetailsContextProviderProps = {
    onPressSheet: sheetPressHandler,
    jobDetails: null,
  };

  return (
    <JobDetailsContext.Provider value={contextValue}>
      {children}
      <JobDetailsBottomSheet ref={modalRef} jobDetails={selectedJobDetails} />
    </JobDetailsContext.Provider>
  );
};

export default JobDetailsContextProvider;

export const useJobDetailsContext = () => {
  const context = React.useContext(JobDetailsContext);
  if (!context) {
    throw new Error(
      'useJobDetailsContext must be used within a JobDetailsContextProvider',
    );
  }
  return context;
};
