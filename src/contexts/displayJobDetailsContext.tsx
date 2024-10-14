import React, {createContext, useRef, useState} from 'react';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import bottomSheetModal from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal';
import {IJobPostTypes} from '@api/features/client/types';
import {IJobPostStatus} from '@utils/enums';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';
import {STRINGS} from 'src/locales/english';
import {
  applyJobAction,
  applyJobActionSearch,
} from '@api/features/employee/employeeSlice';
import {useApplyForJobMutation} from '@api/features/employee/employeeApi';

type IJobDetailsContextProviderProps = {
  onPressSheet: (
    option: 'show' | 'hide',
    JobDetails?: IJobPostTypes | null,
    isSearched?: boolean,
  ) => void;
  jobDetails: IJobPostTypes | null;
  appliedJobDetails: IJobPostTypes | null;
};

const JobDetailsContext = createContext<IJobDetailsContextProviderProps | null>(
  null,
);

const JobDetailsContextProvider = ({children}: {children: React.ReactNode}) => {
  const modalRef = useRef<bottomSheetModal | null>(null);
  const user = useSelector(userBasicDetailsFromState);
  const toast = useToast();
  const [applyForJob] = useApplyForJobMutation();
  const dispatch = useDispatch();
  const [isSearch, setIsSearch] = useState(false);
  const [appliedJobDetailState, setAppliedJobDetailState] =
    useState<IJobPostTypes | null>(null);
  const [selectedJobDetails, updateSelectedJobDetails] =
    useState<IJobPostTypes | null>(null);

  const sheetPressHandler = (
    option: 'show' | 'hide',
    JobDetails?: IJobPostTypes | null,
    isSearchFlow?: boolean,
  ) => {
    if (JobDetails) {
      updateSelectedJobDetails(JobDetails);
      setAppliedJobDetailState(null);
      if (isSearchFlow !== undefined) {
        setIsSearch(isSearchFlow);
      }
    }
    if (option === 'show') {
      modalRef.current?.snapToIndex(1);
    } else {
      modalRef.current?.snapToIndex(0);
    }
  };

  const onPressJobHandler = withAsyncErrorHandlingPost(
    async () => {
      modalRef.current?.close();
      if (selectedJobDetails?.id && selectedJobDetails?.id && user) {
        const applyJobResponse = await applyForJob({
          data: {
            jobs: selectedJobDetails?.id,
            applicationDate: new Date(),
            status: IJobPostStatus.APPLIED,
            employee_details: user.details?.detailsId ?? 0,
          },
        }).unwrap();
        if (applyJobResponse) {
          showToast(toast, STRINGS.job_applied_successfully, 'success');
          if (selectedJobDetails !== null) {
            let jobDetails = {
              ...selectedJobDetails,
              status: IJobPostStatus.APPLIED,
            };
            if (isSearch) {
              setAppliedJobDetailState(jobDetails);
              dispatch(applyJobActionSearch(jobDetails));
            } else {
              dispatch(applyJobAction(jobDetails));
            }
          }
        }
      }
    },
    toast,
    dispatch,
  );

  const onCloseHandler = () => {
    updateSelectedJobDetails(null);
    modalRef.current?.snapToIndex(0);
  };

  const contextValue: IJobDetailsContextProviderProps = {
    onPressSheet: sheetPressHandler,
    jobDetails: null,
    appliedJobDetails: appliedJobDetailState,
  };

  return (
    <JobDetailsContext.Provider value={contextValue}>
      {children}
      <JobDetailsBottomSheet
        onClose={onCloseHandler}
        onPressApply={() =>
          selectedJobDetails && onPressJobHandler(selectedJobDetails)
        }
        ref={modalRef}
        jobDetails={selectedJobDetails}
      />
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
