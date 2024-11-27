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
  IEmployeeDocument,
  IEmployeeUploadOtherDocumentsRequest,
  ISubmitOtherDocumentsResponse,
  IUpdateUserDetailsRequest,
} from '@api/features/user/types';
import {
  addNewDocumentEmployee,
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
import {getImageUrl} from '@utils/constants';
import {useTheme} from '@theme/Theme.context';
import {IDocumentNames, IEmployeeDocsApiKeys} from '@utils/enums';
import {getDocNameCodeThroughName} from './types';
import {useUpdateUserPrimaryDocumentsMutation} from '@api/features/employee/employeeApi';

const EmployeeDocuments = () => {
  const styles = useThemeAwareObject(getStyles);
  const user = useSelector(userAdvanceDetailsFromState) as IEmployeeDetails;

  const {uploadImage} = useUploadAssets();
  const documentSelector = useRef<BottomSheetModal | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [document, setDocuments] = useState<IDropDownItem[]>([]);
  const [uploadNewDoc] = useSubmitOtherDocumentsMutation();
  const [getUserDetails] = useLazyGetUserQuery();
  const [updateEmployeeDocument] = useUpdateUserPrimaryDocumentsMutation();
  const [currentDocumentToUpdate, setCurrentDocumentToUpdate] =
    useState<IDocumentNames>(IDocumentNames.SIN_DOCUMENT);
  const [validUpdateDocument, setValidUpdateDocument] = useState<
    {name: string; key: IDocumentNames}[]
  >([]);
  const [uploadPrevDocuments] = useUpdateEmployeeDetailsMutation();
  const navigation = useNavigation<NavigationProps>();
  const toast = useToast();
  const {theme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const newDocRef = useRef<BottomSheetModal | null>(null);
  const [refreshing, updateRefreshing] = useState(false);

  useEffect(() => {
    if (user.documents?.primary) {
      let options: {name: string; key: IDocumentNames}[] = [];
      let previousDocs = [...user.documents.primary];
      previousDocs?.map(doc => {
        if (
          doc.docStatus === IDocumentStatus.APPROVED ||
          doc.docStatus === IDocumentStatus.DENIED
        ) {
          options.push({
            name: getDocNameCodeThroughName(doc.apiKey as IEmployeeDocsApiKeys)
              .name,
            key: getDocNameCodeThroughName(doc.apiKey as IEmployeeDocsApiKeys)
              .key,
          });
        }
      });
      setValidUpdateDocument(options);
    }
  }, [user.documents]);

  useEffect(() => {
    setDocuments(prev => {
      const prevDocs = [...prev];
      prevDocs.push({
        label: STRINGS.new_document,
        value: STRINGS.new_document,
      });
      prevDocs.push({
        label: STRINGS.resume_simple,
        value: STRINGS.resume_simple,
      });

      const securityAdvDocIndex = user.documents?.primary?.findIndex(
        doc => doc.docName === STRINGS.license_advance,
      );
      if (securityAdvDocIndex === -1) {
        prevDocs.push({
          label: STRINGS.license_advance,
          value: STRINGS.license_advance,
        });
      }
      const securityBasicDocIndex = user.documents?.primary?.findIndex(
        doc => doc.docName === STRINGS.license_basic,
      );
      if (securityBasicDocIndex === -1) {
        prevDocs.push({
          label: STRINGS.license_basic,
          value: STRINGS.license_basic,
        });
      }
      const uniqueOptions = prevDocs.filter(
        (option, index, self) =>
          self.findIndex(o => o.label === option.label) === index,
      );

      return uniqueOptions;
    });
  }, []);

  // to refresh user details on pull to refresh
  const fetchUserDetailsHandler = useCallback(async () => {
    updateRefreshing(true);
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
  }, []);

  // to add a new other document or upload a previously not uploaded document
  const addNewDocHandler = async (doc: INewSelectedDocument) => {
    try {
      dispatch(setLoading(true));
      const keyMap = {
        [STRINGS.license_advance]: 'securityDocumentAdv',
        [STRINGS.license_basic]: 'securityDocumentBasic',
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
      const response: ISubmitOtherDocumentsResponse = await (key
        ? uploadPrevDocuments(requestData as IUpdateUserDetailsRequest)
        : uploadNewDoc(requestData as IEmployeeUploadOtherDocumentsRequest)
      ).unwrap();
      if (doc.docType === STRINGS.new_document) {
        if (response.data as unknown as ISubmitOtherDocumentsResponse) {
          const docs = response.data[0];
          let uploadedDoc: IEmployeeDocument = {
            doc: {
              name: docs.Document.name,
              size: docs.Document.size,
              id: docs.Document.id,
              url: getImageUrl(docs.Document.url),
              mime: docs.Document.mime,
            },
            docId: docs.id,
            docName: docs.name,
            docStatus: docs.Docstatus,
          };
          dispatch(
            addNewDocumentEmployee({document: uploadedDoc, type: 'secondary'}),
          );
          showToast(toast, 'Document added successfully', 'success');
          // dispatch(addNewDocument({id: re}))
        }
      } else {
        if (response.data) {
          showToast(toast, 'Document added successfully', 'success');
        }
      }
    } catch (error) {
      showToast(toast, 'Failed to add document', 'error');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // to update previously approved documents
  const updateDocument = async (asset: IFile[]) => {
    dispatch(setLoading(true));
    try {
      const response = await uploadImage({asset: asset});
      if (response && user.detailsId) {
        const doucmentResponse = await updateEmployeeDocument({
          data: {
            document: response[0].id,
            DocName: currentDocumentToUpdate,
            status: IDocumentStatus.PENDING,
            employee_detail: user.detailsId,
          },
        }).unwrap();
        console.log(doucmentResponse, 'RESPONSE RESUME');
      }
    } catch (error) {
      console.log(error, 'ERROR');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // execute once the document to update is selected
  const onSelectDocumentToUpdate = (e: {name: string; key: IDocumentNames}) => {
    setCurrentDocumentToUpdate(e.key);
    documentSelector.current?.snapToIndex(1);
  };

  return (
    <SafeAreaView>
      <HeaderWithBack
        headerStyles={styles.header}
        isDark
        icon={STATUS}
        renderRightIcon
        onPressRightIcon={() => navigation.navigate('updatedDocumentStatus')}
        headerTitle={STRINGS.documents}
      />
      <StatusBar backgroundColor={theme.color.primary} />
      <View style={styles.mainView}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchUserDetailsHandler}
            />
          }>
          {user.resume?.doc?.url && (
            <>
              <Row alignCenter spaceBetween style={styles.docHeadingContainer}>
                <Text style={styles.heading}>{STRINGS.resume_title}</Text>
              </Row>
              <View style={styles.listView}>
                <PreUploadedDocCardWithView
                  document={user.resume}
                  withTitle={false}
                  navigation={navigation}
                />
              </View>
              <Spacers type="vertical" scalable />
            </>
          )}
          <View style={styles.docHeadingContainer}>
            <Text style={styles.heading}>{STRINGS.mandatoryDocs}</Text>
          </View>
          <View style={styles.listView}>
            {user.documents?.primary?.map(doc => (
              <PreUploadedDocCardWithView
                document={doc}
                key={doc.docId}
                withTitle={true}
                navigation={navigation}
              />
            ))}
          </View>
          <Spacers type="vertical" scalable />
          <View style={styles.docHeadingContainer}>
            <Text style={styles.heading}>{STRINGS.otherDocs}</Text>
          </View>
          <View style={styles.listView}>
            {user.documents?.secondary?.map(doc => (
              <PreUploadedDocCardWithView
                document={doc}
                key={doc.docId}
                withTitle={true}
                navigation={navigation}
              />
            ))}
          </View>
          <Spacers type="vertical" scalable />
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
              <Text style={styles.value}>
                {user?.bankDetails?.transitNumber}
              </Text>
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
      />
    </SafeAreaView>
  );
};

export default EmployeeDocuments;
