/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale, windowHeight} from '@utils/metrics';
import {
  useCancelDocumentRequestMutation,
  useLazyGetUpdatedEmployeeDocumentsRequestQuery,
  useReplaceUpdateDocRequestMutation,
} from '@api/features/user/userApi';
import {
  withAsyncErrorHandlingGet,
  withAsyncErrorHandlingPost,
} from '@utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  cancelDocumentRequest,
  updateRejectedDocument,
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
import SelectImagePopup from '@components/molecules/selectimagepopup';
import useUploadAssets from 'src/hooks/useUploadAsset';
import {IFile} from '@components/organisms/uploadPopup/types';
import {ICustomErrorResponse} from '@api/types';
import {setLoading} from '@api/features/loading/loadingSlice';

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
  const documentSelector = useRef<BottomSheetModal | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [replaceUpdateDocRequest] = useReplaceUpdateDocRequestMutation();
  const {uploadImage} = useUploadAssets();
  const [cancelUpdateRequest] = useCancelDocumentRequestMutation();
  const [isFetching, setIsFetching] = useState(true);
  const [getRequests, {isFetching: loading, error}] =
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

  useEffect(() => {
    setIsFetching(loading);
  }, [loading]);

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
        console.log(response, 'response');

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

  //replace rejected document
  const onPressReplaceDoc = (id: number | null) => {
    setSelectedDocId(id);
    documentSelector.current?.snapToIndex(1);
  };

  const renderItem = useCallback(
    ({item}: {item: IEmployeeDocument}) => {
      return (
        <UpdatedDocumentStatusCard
          title={STRINGS.sinDocument}
          status={item.docStatus}
          asset={item}
          onPressReplace={() => onPressReplaceDoc(item.docId)}
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

  const updateDocument = async (asset: IFile[]) => {
    dispatch(setLoading(true));
    try {
      const response = await uploadImage({asset: asset});
      if (response && user?.details?.detailsId) {
        const docResponse = await replaceUpdateDocRequest({
          prevID: selectedDocId ?? 0,
          args: {
            document: response[0].id,
            employee_detail: user?.details?.detailsId,
            status: IDocumentStatus.PENDING,
          },
        }).unwrap();
        if (docResponse) {
          showToast(toast, 'document updated Successfully', 'success');
          setRequestedDocs(prev => {
            let preDocs = [...prev];
            const index = preDocs.findIndex(doc => doc.docId === selectedDocId);
            if (index !== -1) {
              preDocs[index] = docResponse;
            }
            return preDocs;
          });
          dispatch(updateRejectedDocument(docResponse));
        }
      }
    } catch (err) {
      const error = err as ICustomErrorResponse;
      showToast(toast, error.message, 'error');
      console.log(error, 'ERROR');
    } finally {
      dispatch(setLoading(false));
    }
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
            blankViewStyles={styles.blankView}
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
      <SelectImagePopup
        isDocumentMultiple={false}
        selectionLimit={1}
        getSelectedImages={asset => updateDocument(asset.assets)}
        compRef={documentSelector}
      />
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
      paddingHorizontal: 2,
    },
    loadingView: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blankView: {
      height: windowHeight / 1.5,
    },
  });
