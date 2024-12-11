/* eslint-disable react-hooks/exhaustive-deps */
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import HelpAndSupportCard from '@components/organisms/helpAndSupportCard';
import {
  IHelpAndSupportTicketStatus,
  IIssueStatus,
  IUserTypeEnum,
} from '@utils/enums';
import BottomButtonView from '@components/organisms/bottomButtonView';
import GetHelpBottomSheet from '@components/molecules/GetHelpBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch, useSelector} from 'react-redux';
import {
  useLazyGetIssuesQuery,
  useRaiseAnIssueMutation,
} from '@api/features/user/userApi';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {IRaiseIssueArgs, Issue} from '@api/features/user/types';
import {showToast} from '@components/organisms/customToast';
import HelpAndSupportCardLoading from '@components/organisms/helpAndSupportCardLoading';
import CustomList from '@components/molecules/customList';
import {mockJobPostsLoading} from '@api/mockData';
import {verticalScale} from '@utils/metrics';

const HelpAndSupport = () => {
  const helpSheetRef = useRef<BottomSheetModal>(null);
  const toast = useToast();
  const user = useSelector(userBasicDetailsFromState);
  const dispatch = useDispatch();
  const [raiseAnIssue] = useRaiseAnIssueMutation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [help, setHelp] = useState<Issue[]>([]);
  const [getIssues, {error}] = useLazyGetIssuesQuery();
  const [isLoading, setIsLoading] = useState(true);
  const onPress = () => {
    helpSheetRef.current?.snapToIndex(1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getIssuesHandler();
  };

  const renderItemLoading = () => {
    return <HelpAndSupportCardLoading />;
  };

  const renderItem = useCallback(
    ({item}: {item: Issue}) => (
      <HelpAndSupportCard
        date={item.createdAt}
        status={item.status}
        description={item.Issue}
      />
    ),
    [help],
  );

  const postIssueHandler = withAsyncErrorHandlingPost(
    async (e: string) => {
      let args: IRaiseIssueArgs = {
        Issue: e,
        status: IIssueStatus.OPEN,
        user_type: IUserTypeEnum.EMPLOYEE,
      };
      if (user?.user_type === IUserTypeEnum.EMPLOYEE) {
        args = {
          ...args,
          employee_detail: user.details?.detailsId ?? 0,
          user_type: IUserTypeEnum.EMPLOYEE,
        };
      }
      if (user?.user_type === IUserTypeEnum.CLIENT) {
        args = {
          ...args,
          client_detail: user.details?.detailsId ?? 0,
          user_type: IUserTypeEnum.CLIENT,
        };
      }
      const response = await raiseAnIssue(args).unwrap();
      if (response) {
        setHelp(prev => {
          let prevTick = [...prev];
          prevTick.unshift({
            Issue: e,
            createdAt: new Date(),
            id: 0,
            status: IHelpAndSupportTicketStatus.OPEN,
          });
          return prevTick;
        });
        showToast(toast, 'Issue raised successfully', 'success');
      }
    },
    toast,
    dispatch,
  );

  useEffect(() => {
    getIssuesHandler();
  }, []);

  const getIssuesHandler = async () => {
    try {
      const response = await getIssues({
        detailId: user?.details?.detailsId ?? 0,
        empType: user?.user_type as IUserTypeEnum,
      }).unwrap();
      if (response) {
        setHelp(response);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack headerTitle="Help" />
      <View style={styles.container}>
        <CustomList
          data={isLoading ? mockJobPostsLoading : help}
          renderItem={isLoading ? renderItemLoading : renderItem}
          error={error}
          isRefreshing={refreshing}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{height: verticalScale(24)}}
          onRefresh={onRefresh}
          isLastPage={true}
        />
      </View>
      <BottomButtonView
        disabled={false}
        title="Get Help"
        onButtonPress={onPress}
      />
      <GetHelpBottomSheet ref={helpSheetRef} onPressSend={postIssueHandler} />
      {Platform.OS === 'android' && (
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={'#fff'}
        />
      )}
    </SafeAreaView>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(24),
  },
});
