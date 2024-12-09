import {StyleSheet, View} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import UploadDocView from '@components/organisms/uploadPopup';
import {STRINGS} from 'src/locales/english';
import {
  jobSeekerDetailsStepThreeState,
  jobSeekerThirdRef,
  PredefinedCertificates,
  predefinedCertificatesAndLicenses,
} from './types';
import Spacers from '@components/atoms/Spacers';
import {userDetailsStep3Schema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import UploadOtherCertificatesBottomSheet, {
  IOtherDocument,
} from '@components/organisms/uploadOtherCertificateBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useDispatch} from 'react-redux';
import {setLoading} from '@api/features/loading/loadingSlice';
import useUploadAssets from 'src/hooks/useUploadAsset';

const JobSeekerDetailsStepsThree = forwardRef<{}, jobSeekerThirdRef>(
  (_, ref) => {
    const dispatch = useDispatch();
    const {uploadImage} = useUploadAssets();

    const [state, setState] = useReducer(
      (
        prev: jobSeekerDetailsStepThreeState,
        next: Partial<jobSeekerDetailsStepThreeState>,
      ) => ({...prev, ...next}),
      {
        govtId: null,
        document: null,
        resume: null,
        licenseAdvanced: null,
        licenseBasic: null,
        govtIdError: '',
        documentError: '',
      },
    );

    const otherDocRef = useRef<BottomSheetModal | null>(null);

    const [otherDocuments, setOtherDocuments] = useState<IOtherDocument[]>([]);
    const onSelectPredefinedCertificates = (cert: PredefinedCertificates[]) => {
      setState({
        licenseAdvanced: cert[0]?.value?.id || null,
        licenseBasic: cert[1]?.value?.id || null,
      });
    };

    const uploadOtherDocuments = async (document: IOtherDocument) => {
      try {
        dispatch(setLoading(true));
        const response = await uploadImage({asset: [document]});
        if (response) {
          setOtherDocuments(prev => [
            ...prev,
            {...document, id: response[0].id},
          ]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    const validateStepThree = async () => {
      try {
        const fields = await userDetailsStep3Schema.validate(
          {govtid: state.govtId, supportingDocument: state.document},
          {abortEarly: false},
        );

        let docs: any = [
          fields.govtid && {name: STRINGS.Govt_ID, Document: fields.govtid},
          fields.supportingDocument && {
            name: STRINGS.document,
            Document: fields.supportingDocument,
          },
          state.licenseAdvanced && {
            name: STRINGS.license_advance,
            Document: state.licenseAdvanced,
          },
          state.licenseBasic && {
            name: STRINGS.license_basic,
            Document: state.licenseBasic,
          },
        ].filter(Boolean);

        docs = [
          ...docs,
          ...otherDocuments.map(doc => ({
            name: doc?.name || '',
            Document: doc.id,
          })),
        ];

        return {documents: docs, resume: state.resume ?? null, isValid: true};
      } catch (error) {
        const validationErrors = error as ValidationError;
        const firstError = validationErrors.inner[0];
        const errorField =
          firstError.path === 'govtid' ? 'govtIdError' : 'documentError';

        setState({[errorField]: firstError.message});
        return {fields: null, isValid: false};
      }
    };

    useImperativeHandle(ref, () => ({validate: validateStepThree}));

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          scrollToOverflowEnabled
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={false}>
          <UploadDocView
            title={STRINGS.Govt_ID}
            error={state.govtIdError}
            getSelectedDocumentIds={ids => setState({govtId: ids[0]})}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.document}
            error={state.documentError}
            getSelectedDocumentIds={ids => setState({document: ids[0]})}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.Licenses}
            predefinedCertificates={predefinedCertificatesAndLicenses}
            getPredefinedCertificates={onSelectPredefinedCertificates}
            error={''}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.Resume}
            getSelectedDocumentIds={ids => setState({resume: ids[0]})}
            error={''}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.other}
            isOtherType
            initialDocuments={otherDocuments}
            getSelectedDocuments={files => setOtherDocuments(files)}
            multipleLimit={6 - otherDocuments.length}
            onPressOther={() => otherDocRef.current?.snapToIndex(1)}
            error={''}
          />
          <UploadOtherCertificatesBottomSheet
            ref={otherDocRef}
            getAddedCertificate={uploadOtherDocuments}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  },
);

export default JobSeekerDetailsStepsThree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
