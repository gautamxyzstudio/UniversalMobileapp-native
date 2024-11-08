/* eslint-disable react-hooks/exhaustive-deps */
import {View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import ShortlistedCandidateCard from '@components/client/ShortlistedCandidateCard';
import {
  useCheckInOutEmployeesMutation,
  useLazyGetCandidatesListQuery,
} from '@api/features/client/clientApi';
import {IGetShortlistedCandidatesParams} from './types';
import {useDispatch} from 'react-redux';
import {IC_NO_SHORTLISTED, SEARCH} from '@assets/exporter';
import CandidateListTopView from '@components/client/CandidateListTopView';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {createStyles} from './styles';
import ShortlistedCandidateLoadingCard from '@components/client/ShortlistedCandidateLoadingCard';
import {mockJobPostsLoading} from '@api/mockData';
import {ICandidateTypes} from '@api/features/client/types';
import CustomList from '@components/molecules/customList';
import CheckinCheckoutBottomSheet from '@components/client/CheckinCheckoutBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useUserDetailsViewCandidateListContext} from '../candidateList/UserDetailsViewCandidateList';
import {timeOutTimeSheets} from 'src/constants/constants';
import {setLoading} from '@api/features/loading/loadingSlice';
import {ICustomErrorResponse} from '@api/types';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';

const ShortListedCandidates: React.FC<IGetShortlistedCandidatesParams> = ({
  route,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const dispatch = useDispatch();
  const [search, updateSearch] = useState<string | undefined>('');
  const [checkInOut] = useCheckInOutEmployeesMutation();
  const [inputType, setInputType] = useState<'checkIn' | 'checkOut'>('checkIn');
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredApplications, setFilteredApplications] = useState<
    ICandidateTypes[] | null
  >(null);
  const [selectedApplication, setSelectedApplication] =
    useState<ICandidateTypes | null>(null);
  const {onPressSheet} = useUserDetailsViewCandidateListContext();
  const [shortlistedCandidates, updateShortlistedCandidates] = useState<
    ICandidateTypes[]
  >([]);
  const jobId = route?.params?.jobId;
  const jobName = route?.params?.name;
  const createdAt = route?.params?.createdAt;
  const sheetRef = useRef<BottomSheetModal | null>(null);

  const [getShortlistedCandidates, {isFetching, error}] =
    useLazyGetCandidatesListQuery();

  const getApplications = async (jId: number) => {
    if (jobId) {
      try {
        const applicants = await getShortlistedCandidates({
          type: 'shortlisted',
          jobId: jId,
        }).unwrap();
        if (applicants) {
          setFilteredApplications(applicants);
          updateShortlistedCandidates(applicants);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const onPressButton = (
    type: 'checkIn' | 'checkOut',
    item: ICandidateTypes,
  ) => {
    setInputType(type);
    setSelectedApplication(item);
    setTimeout(() => {
      sheetRef.current?.snapToIndex(1);
    }, timeOutTimeSheets);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getApplications(jobId);
  };

  useEffect(() => {
    getApplications(jobId);
  }, [jobId]);

  useEffect(() => {
    if (search && search?.length > 0) {
      let filtered = shortlistedCandidates?.filter(candidate =>
        candidate.employeeDetails.name
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(shortlistedCandidates);
    }
  }, [search]);

  console.log('===================================---========------=-=-=-=');
  console.log(filteredApplications);
  console.log('===================================---========------=-=-=-=');

  const CheckInOutHandler = async (
    date: Date,
    type: 'checkIn' | 'checkOut',
  ) => {
    if (selectedApplication) {
      let args: {
        CheckIn?: Date;
        CheckOut?: Date;
      } = {};
      args[type === 'checkIn' ? 'CheckIn' : 'CheckOut'] = date;
      setTimeout(async () => {
        try {
          dispatch(setLoading(true));
          const checkInOutRes = await checkInOut({
            args: args,
            applicationId: selectedApplication.id,
          }).unwrap();
          if (checkInOutRes) {
            updateShortlistedCandidates(prev => {
              let prevCandidate = [...prev];
              let index = prevCandidate.findIndex(
                c => c.id === selectedApplication.id,
              );
              if (index !== -1) {
                prevCandidate[index] = {
                  ...prevCandidate[index],
                  [type === 'checkIn' ? 'CheckIn' : 'CheckOut']: new Date(date),
                };
              }
              return prevCandidate;
            });
            showToast(
              toast,
              `${type === 'checkIn' ? 'Check-in' : 'Check-out'} successful`,
              'success',
            );
          }
        } catch (e) {
          let err = e as ICustomErrorResponse;
          showToast(toast, err.message, 'error');
          console.log(e);
        } finally {
          dispatch(setLoading(false));
        }
      }, timeOutTimeSheets);
    }
  };

  const renderItem = useCallback(
    ({item}: {item: ICandidateTypes}) => {
      return (
        <ShortlistedCandidateCard
          onPressCard={() =>
            onPressSheet('show', 'shortlisted', item, item.jobId)
          }
          checkInTime={item.CheckIn}
          checkOutTime={item.CheckOut}
          name={item.employeeDetails.name}
          profilePic={item.employeeDetails.selfie?.url ?? ''}
          onPressCheckIn={type => onPressButton(type, item)}
          onPressCheckOut={type => onPressButton(type, item)}
        />
      );
    },
    [ShortListedCandidates],
  );

  const renderItemLoading = useCallback(() => {
    return <ShortlistedCandidateLoadingCard />;
  }, []);

  return (
    <OnBoardingBackground
      isInlineTitle
      displayRightIcon
      searchValue={search}
      onChangeSearchValue={e => updateSearch(e)}
      onPressSearchCross={() => updateSearch('')}
      childrenStyles={styles.container}
      rightIcon={SEARCH}
      isSearch
      title={STRINGS.check_in}>
      <CandidateListTopView
        jobName={jobName}
        jobId={jobId}
        creationDate={createdAt}
        withSwitch={false}
        withSegmentView={false}
      />
      <View style={styles.mainView}>
        <CustomList
          contentContainerStyle={styles.list}
          estimatedItemSize={196}
          onRefresh={onRefresh}
          getItemType={(item: any) => `${item?.id}`}
          refreshing={refreshing}
          data={isFetching ? mockJobPostsLoading : filteredApplications}
          renderItem={isFetching ? renderItemLoading : renderItem}
          emptyListMessage={STRINGS.no_shortlisted}
          emptyListIllustration={IC_NO_SHORTLISTED}
          emptyListSubTitle={STRINGS.please_review}
          error={error}
          isLastPage={true}
        />
      </View>
      <CheckinCheckoutBottomSheet
        ref={sheetRef}
        type={inputType}
        onPressButton={CheckInOutHandler}
      />
    </OnBoardingBackground>
  );
};

export default ShortListedCandidates;
