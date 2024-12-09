/* eslint-disable react-hooks/exhaustive-deps */
import {RefreshControl, ScrollView, StatusBar, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import PreUploadedDocCardWithView from '@components/doucment/PreUploadedDocCardWithView';
import Spacers from '@components/atoms/Spacers';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {STATUS} from '@assets/exporter';
import SelectDocumentToUpdatePopup from '@components/doucment/SelectDocumentToUpdatePopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useDispatch, useSelector} from 'react-redux';
import {
  IDocumentStatus,
  IEmployeeDetails,
  IEmployeeUploadOtherDocumentsRequest,
  IUpdateUserDetailsRequest,
} from '@api/features/user/types';
import {
  addNewUpdateRequest,
  replaceRejectedDocument,
  updateEmployeeDetails,
  userAdvanceDetailsFromState,
} from '@api/features/user/userSlice';
import UploadNewDocumentFromProfilePopup, {
  INewSelectedDocument,
} from '@components/employee/UploadNewDocumentFromProfilePopup';
import {IDropDownItem} from '@components/molecules/dropdownPopup';
import {AppDispatch} from '@api/store';
import {
  useLazyGetUserQuery,
  useReplaceRejectedDocumentMutation,
  useSubmitOtherDocumentsMutation,
  useUpdateEmployeeDetailsMutation,
} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {useToast} from 'react-native-toast-notifications';
import {showToast} from '@components/organisms/customToast';
import {Row} from '@components/atoms/Row';
import SelectImagePopup from '@components/molecules/selectimagepopup';
import useUploadAssets from 'src/hooks/useUploadAsset';
import {IFile} from '@components/organisms/uploadPopup/types';
import {useTheme} from '@theme/Theme.context';
import {useUpdateUserPrimaryDocumentsMutation} from '@api/features/employee/employeeApi';
import {ICustomErrorResponse} from '@api/types';
import {verticalScale} from '@utils/metrics';

const EmployeeDocuments = () => {
  const styles = useThemeAwareObject(getStyles);
  const user = useSelector(userAdvanceDetailsFromState) as IEmployeeDetails;
  const [docsName, setDocsNames] = useState<string[]>();
  const {uploadImage} = useUploadAssets();
  const documentSelector = useRef<BottomSheetModal | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [document, setDocuments] = useState<IDropDownItem[]>([]);
  const [uploadNewDoc] = useSubmitOtherDocumentsMutation();
  const [getUserDetails] = useLazyGetUserQuery();
  const [replaceRejectedDoc] = useReplaceRejectedDocumentMutation();
  const [updateEmployeeDocument] = useUpdateUserPrimaryDocumentsMutation();
  const [currentDocumentToUpdate, setCurrentDocumentToUpdate] =
    useState<string>('');
  const [validUpdateDocument, setValidUpdateDocument] = useState<
    {name: string; key: string}[]
  >([]);
  const [uploadPrevDocuments] = useUpdateEmployeeDetailsMutation();
  const navigation = useNavigation<NavigationProps>();
  const toast = useToast();
  const {theme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const newDocRef = useRef<BottomSheetModal | null>(null);
  const [refreshing, updateRefreshing] = useState(false);

  useEffect(() => {
    if (user.documents) {
      let options: {name: string; key: string}[] = [];
      let previousDocs = [...user.documents];
      let docNames: string[] = [];
      let currentDocsRequests = user.update_requests ?? [];
      previousDocs?.forEach(doc => {
        docNames.push(doc.docName);
        let isAlreadyRequested = false;
        currentDocsRequests.forEach(req => {
          if (doc.docName === req.docName) {
            isAlreadyRequested = true;
          }
        });
        if (doc.docStatus === IDocumentStatus.APPROVED && !isAlreadyRequested) {
          options.push({
            name: doc.docName,
            key: doc.docName,
          });
        }
      });
      setDocsNames(docNames);
      setValidUpdateDocument(options);
    }
  }, [user]);

  useEffect(() => {
    let prevDocs = [...document];
    prevDocs.push({
      label: STRINGS.new_document,
      value: STRINGS.new_document,
    });
    prevDocs.push({
      label: STRINGS.resume_simple,
      value: STRINGS.resume_simple,
    });
    const securityDocAdv =
      user.documents?.find(doc => doc.docName === STRINGS.license_advance) ??
      null;

    if (securityDocAdv) {
      prevDocs = prevDocs.filter(doc => doc.label !== STRINGS.license_advance);
    } else {
      prevDocs.push({
        label: STRINGS.license_advance,
        value: STRINGS.license_advance,
      });
    }
    const securityDocBasic =
      user.documents?.find(doc => doc.docName === STRINGS.license_basic) ??
      null;
    if (securityDocBasic) {
      prevDocs = prevDocs.filter(doc => doc.label !== STRINGS.license_basic);
    } else {
      prevDocs.push({
        label: STRINGS.license_basic,
        value: STRINGS.license_basic,
      });
    }
    const uniqueOptions = prevDocs.filter(
      (option, index, self) =>
        self.findIndex(o => o.label === option.label) === index,
    );

    setDocuments(uniqueOptions);
  }, [user]);

  const onRefresh = () => {
    updateRefreshing(true);
    fetchUserDetailsHandler();
  };

  // to refresh user details on pull to refresh
  const fetchUserDetailsHandler = async () => {
    try {
      const response = (await getUserDetails(
        null,
      ).unwrap()) as IEmployeeDetails;
      dispatch(updateEmployeeDetails(response));
    } catch (error) {
      showToast(toast, STRINGS.unable_to_fetch_user_details, 'error');
    } finally {
      updateRefreshing(false);
    }
  };

  // to add a new other document or upload a previously not uploaded document
  const addNewDocHandler = async (doc: INewSelectedDocument) => {
    try {
      dispatch(setLoading(true));
      const keyMap = {
        [STRINGS.resume_simple]: 'resume',
      };
      const key = keyMap[doc.docType] || null;
      const requestData = key
        ? {
            data: {
              data: {
                [key]: doc.docValue,
              },
              docId: user.detailsId as number,
            },
          }
        : {
            data: [
              {
                name: doc.name,
                Document: doc.docValue,
                employee_detail: user.detailsId ?? 0,
                Docstatus: IDocumentStatus.PENDING,
              },
            ],
          };
      const response = await (key
        ? uploadPrevDocuments(requestData as IUpdateUserDetailsRequest)
        : uploadNewDoc(requestData as IEmployeeUploadOtherDocumentsRequest)
      ).unwrap();
      if (response) {
        showToast(toast, 'Document added successfully', 'success');
      }
    } catch (error) {
      showToast(toast, 'Failed to add document', 'error');
    } finally {
      dispatch(setLoading(false));
      fetchUserDetailsHandler();
    }
  };

  // to update previously approved documents
  const updateDocument = async (asset: IFile[]) => {
    dispatch(setLoading(true));
    try {
      const response = await uploadImage({asset: asset});
      if (response && user.detailsId) {
        if (selectedDocId) {
          const docResponse = await replaceRejectedDoc({
            prevID: selectedDocId,
            args: {
              data: {
                Document: response[0].id,
                employee_detail: user.detailsId,
                Docstatus: IDocumentStatus.PENDING,
              },
            },
          }).unwrap();
          if (docResponse) {
            dispatch(replaceRejectedDocument(docResponse));
            showToast(toast, 'Document Updated', 'success');
            setSelectedDocId(null);
          }
        } else {
          const documentResponse = await updateEmployeeDocument({
            data: {
              document: response[0].id,
              name: currentDocumentToUpdate,
              status: IDocumentStatus.PENDING,
              employee_detail: user.detailsId,
            },
          }).unwrap();
          if (documentResponse) {
            showToast(toast, 'Document Request Created', 'success');
            dispatch(addNewUpdateRequest(documentResponse));
          }
        }
      }
    } catch (error) {
      const err = error as ICustomErrorResponse;
      showToast(toast, err.message, 'error');
      console.log(error, 'ERROR');
    } finally {
      dispatch(setLoading(false));
    }
  };

  //replace rejected document
  const onPressReplaceDoc = (id: number | null) => {
    setSelectedDocId(id);
    documentSelector.current?.snapToIndex(1);
  };

  // execute once the document to update is selected
  const onSelectDocumentToUpdate = (e: {name: string; key: string}) => {
    setCurrentDocumentToUpdate(e.name);
    documentSelector.current?.snapToIndex(1);
  };

  const renderResume = useCallback(() => {
    return (
      <>
        <Row alignCenter spaceBetween style={styles.docHeadingContainer}>
          <Text style={styles.heading}>{STRINGS.resume_title}</Text>
        </Row>
        <View style={styles.listView}>
          <PreUploadedDocCardWithView
            document={user.resume}
            withTitle={false}
            hideStatus
            navigation={navigation}
          />
        </View>
        <Spacers type="vertical" scalable />
      </>
    );
  }, [user.resume]);

  const renderOtherDocs = useCallback(
    () => (
      <>
        <View style={styles.docHeadingContainer}>
          <Text style={styles.heading}>{STRINGS.mandatoryDocs}</Text>
        </View>
        <View style={styles.listView}>
          {user.documents?.map(doc => (
            <PreUploadedDocCardWithView
              document={doc}
              key={doc.docId}
              onPressReplace={() => onPressReplaceDoc(doc?.docId)}
              withTitle={true}
              hideStatus={false}
              navigation={navigation}
            />
          ))}
        </View>
      </>
    ),
    [user.documents],
  );

  const renderBankingDetails = useCallback(
    () => (
      <>
        <View style={styles.docHeadingContainer}>
          <Text style={styles.heading}>{STRINGS.bankDetails}</Text>
        </View>
        <View style={styles.listView}>
          <View style={styles.details}>
            <Text style={styles.title}>{STRINGS.backAccountNumber}</Text>
            <Text style={styles.value}>
              {user?.bankDetails?.bankAccountNumber}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{STRINGS.transitNumber}</Text>
            <Text style={styles.value}>{user?.bankDetails?.transitNumber}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{STRINGS.institutionNumber}</Text>
            <Text style={styles.value}>
              {user?.bankDetails?.institutionNumber}
            </Text>
          </View>
          {user.bankDetails?.cheque && (
            <PreUploadedDocCardWithView
              document={user.bankDetails?.cheque}
              withTitle={true}
              navigation={navigation}
            />
          )}
        </View>
      </>
    ),
    [user.bankDetails],
  );

  return (
    <SafeAreaView>
      <HeaderWithBack
        headerStyles={styles.header}
        isDark
        icon={STATUS}
        customRightContent={
          <View>
            <STATUS width={verticalScale(24)} height={verticalScale(24)} />
            {user?.update_requests && user?.update_requests?.length > 0 && (
              <View style={styles.redDot} />
            )}
          </View>
        }
        renderRightIcon
        onPressRightIcon={() => navigation.navigate('updatedDocumentStatus')}
        headerTitle={STRINGS.documents}
      />
      <StatusBar backgroundColor={theme.color.primary} />
      <View style={styles.mainView}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {user.resume?.doc?.url && renderResume()}
          {user.documents && renderOtherDocs()}
          <Spacers type="vertical" scalable />
          {user.bankDetails && renderBankingDetails()}
          <Spacers type="vertical" scalable />
        </ScrollView>
      </View>
      <BottomButtonView
        disabled={validUpdateDocument.length === 0}
        isMultiple
        title={STRINGS.add_or_update_document}
        buttonType="filled"
        onPressSecondaryButton={() => newDocRef.current?.snapToIndex(1)}
        secondaryButtonTitles={STRINGS.new_document}
        onButtonPress={() => bottomSheetRef.current?.snapToIndex(1)}
      />
      <SelectDocumentToUpdatePopup
        ref={bottomSheetRef}
        addOrUpdateDocument={e => onSelectDocumentToUpdate(e)}
        documents={validUpdateDocument}
      />
      <SelectImagePopup
        isDocumentMultiple={false}
        selectionLimit={1}
        getSelectedImages={asset => updateDocument(asset.assets)}
        compRef={documentSelector}
      />
      <UploadNewDocumentFromProfilePopup
        ref={newDocRef}
        documentTypes={document}
        getSelectedDocument={addNewDocHandler}
        existingDocs={docsName ?? []}
      />
    </SafeAreaView>
  );
};

export default EmployeeDocuments;
