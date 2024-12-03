/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {
  useCancelDocumentRequestMutation,
  useLazyGetUpdatedEmployeeDocumentsRequestQuery,
} from '@api/features/user/userApi';
import {
  withAsyncErrorHandlingGet,
  withAsyncErrorHandlingPost,
} from '@utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  cancelDocumentRequest,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IDocumentStatus, IEmployeeDocument} from '@api/features/user/types';
import CustomList from '@components/molecules/customList';
import UpdatedDocumentStatusCard from '@components/doucment/UpdatedDocumentStatusCard';
import {useTheme} from '@theme/Theme.context';
import {ActivityIndicator} from 'react-native-paper';
import {CROSS_BUTTON, HELP_SECONDARY, NO_DOCUMENT} from '@assets/exporter';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {timeOutTimeSheets} from 'src/constants/constants';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useToast} from 'react-native-toast-notifications';
import {showToast} from '@components/organisms/customToast';

const UpdateDocumentRequests = () => {
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  const toast = useToast();
  const dispatch = useDispatch();
  const [currentSelectedDoc, setCurrentSelectedDoc] =
    useState<IEmployeeDocument | null>(null);
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);
  const [requestedDocs, setRequestedDocs] = useState<IEmployeeDocument[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [cancelUpdateRequest] = useCancelDocumentRequestMutation();
  const [getRequests, {isFetching, error}] =
    useLazyGetUpdatedEmployeeDocumentsRequestQuery();
  const {theme} = useTheme();
  const user = useSelector(userBasicDetailsFromState);

  useEffect(() => {
    getUpdateRequestsHandler();
  }, []);

  const onRefetch = () => {
    setIsUpdating(true);
    getUpdateRequestsHandler();
  };

  const getUpdateRequestsHandler = withAsyncErrorHandlingGet(async () => {
    const response = await getRequests({
      id: user?.details?.detailsId ?? 0,
    }).unwrap();
    if (response) {
      setRequestedDocs(response);
      setIsUpdating(false);
    }
  });

  const onPressThreeDots = (doc: IEmployeeDocument) => {
    quickActionSheetRef.current?.snapToIndex(1);
    setCurrentSelectedDoc(doc);
  };

  const cancelUpdateRequestHandler = withAsyncErrorHandlingPost(
    async () => {
      const response = await cancelUpdateRequest(
        currentSelectedDoc?.docId ?? 0,
      ).unwrap();
      if (response) {
        dispatch(
          cancelDocumentRequest({docId: currentSelectedDoc?.docId ?? 0}),
        );
        setRequestedDocs(prev => {
          let preDocs = [...prev];
          if (currentSelectedDoc) {
            preDocs = preDocs.filter(
              doc => doc.docId !== currentSelectedDoc?.docId,
            );
          }
          return preDocs;
        });
        showToast(toast, 'Document Request cancelled', 'success');
      }
    },
    toast,
    dispatch,
  );

  console.log(requestedDocs, 'requested docs');

  const renderItem = useCallback(
    ({item}: {item: IEmployeeDocument}) => {
      return (
        <UpdatedDocumentStatusCard
          title={STRINGS.sinDocument}
          status={item.docStatus}
          asset={item}
          onPressThreeDots={onPressThreeDots}
        />
      );
    },
    [requestedDocs],
  );

  const onPressHelpButton = () => {
    quickActionSheetRef.current?.snapToIndex(0);
    setTimeout(() => {
      navigation.navigate('helpAndSupport');
    }, timeOutTimeSheets);
  };

  const onPressCancel = () => {
    quickActionSheetRef.current?.snapToIndex(0);
    setTimeout(() => {
      cancelUpdateRequestHandler();
    }, timeOutTimeSheets);
  };

  return (
    <SafeAreaView
      backgroundColor={theme.color.backgroundWhite}
      paddingHorizontal>
      <HeaderWithBack isDark headerTitle={STRINGS.updatedDocument} />
      <View style={styles.container}>
        {isFetching ? (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={'#FF7312'} />
          </View>
        ) : (
          <CustomList
            data={requestedDocs}
            isRefreshing={isUpdating}
            onRefresh={onRefetch}
            emptyListIllustration={NO_DOCUMENT}
            emptyListMessage="No Update Requests"
            renderItem={renderItem}
            estimatedItemSize={100}
            error={error}
            isLastPage={true}
          />
        )}
      </View>
      <SelectOptionBottomSheet
        modalHeight={216}
        ref={quickActionSheetRef}
        options={[
          {
            icon: HELP_SECONDARY,
            title: STRINGS.help,

            onPress: onPressHelpButton,
          },
          {
            icon: CROSS_BUTTON,
            isDisabled:
              currentSelectedDoc?.docStatus === IDocumentStatus.UPDATE,
            title: STRINGS.cancel,
            onPress: onPressCancel,
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default UpdateDocumentRequests;
const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: verticalScale(24),
    },
    loadingView: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
