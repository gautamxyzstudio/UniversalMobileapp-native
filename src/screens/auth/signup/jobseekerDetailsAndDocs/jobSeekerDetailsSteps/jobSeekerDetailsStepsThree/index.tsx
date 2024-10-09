import {StyleSheet, View} from 'react-native';
import React, {
  forwardRef,
  useEffect,
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
  (props, ref) => {
    const dispatch = useDispatch();
    const {uploadImage} = useUploadAssets();
    const [state, setState] = useReducer(
      (
        prev: jobSeekerDetailsStepThreeState,
        next: jobSeekerDetailsStepThreeState,
      ) => {
        return {
          ...prev,
          ...next,
        };
      },
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

    console.log(state, 'sonone');

    const otherDocRef = useRef<BottomSheetModal | null>(null);
    const [predefinedCertificates, setPredefinedCertificates] = useState<
      PredefinedCertificates[]
    >([]);
    const [otherDocuments, setOtherDocuments] = useState<IOtherDocument[]>([]);

    useEffect(() => {
      setPredefinedCertificates(predefinedCertificatesAndLicenses);
    }, []);

    const onSelectPredefinedCertificates = (cert: PredefinedCertificates[]) => {
      if (cert[0].value) {
        setState({...state, licenseAdvanced: cert[0].value.id});
      }
      if (cert[1]?.value) {
        setState({...state, licenseBasic: cert[1].value.id});
      }
    };

    const uploadOtherDocuments = async (document: IOtherDocument) => {
      try {
        dispatch(setLoading(true));
        const response = await uploadImage({asset: [document]});
        if (response) {
          const prev = [...otherDocuments];
          prev.push({...document, id: response[0].id});
          setOtherDocuments(prev);
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    useImperativeHandle(ref, () => ({
      validate: validateStepThree,
    }));

    console.log(otherDocuments, 'OTHER DOCUMENTS');

    const validateStepThree = async () => {
      try {
        const fields = await userDetailsStep3Schema.validate(
          {govtid: state.govtId, supportingDocument: state.document},
          {
            abortEarly: false,
          },
        );
        const otherDocs = otherDocuments
          .map(doc => {
            if (doc) {
              return {
                docId: doc.id,
                name: doc.name,
              };
            }
            return null;
          })
          .filter(Boolean);

        if (fields) {
          return {
            fields: {
              resume: state.resume,
              govtid: state.govtId,
              securityDocumentAdv: state.licenseAdvanced,
              securityDocumentBasic: state.licenseBasic,
              supportingDocument: state.document,
            },
            otherDocs: otherDocs,
            isValid: true,
          };
        }
      } catch (error) {
        const validationErrors = error as ValidationError;
        if (validationErrors.inner[0].path === 'govtid') {
          setState({
            ...state,
            govtIdError: validationErrors.inner[0].message,
          });
        } else if (validationErrors.inner[0].path === 'supportingDocument') {
          setState({
            ...state,
            documentError: validationErrors.inner[0].message,
          });
        }
        return {
          fields: null,
          isValid: false,
        };
      }
    };

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
            getSelectedDocumentIds={ids => setState({...state, govtId: ids[0]})}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.document}
            error={state.documentError}
            getSelectedDocumentIds={ids =>
              setState({...state, document: ids[0]})
            }
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.Licenses}
            predefinedCertificates={predefinedCertificates}
            error={''}
            getPredefinedCertificates={onSelectPredefinedCertificates}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            getSelectedDocumentIds={ids => setState({...state, resume: ids[0]})}
            title={STRINGS.Resume}
            error={''}
          />
          <Spacers size={16} type="vertical" />
          <UploadDocView
            title={STRINGS.other}
            getSelectedDocuments={files => setOtherDocuments(files)}
            multipleLimit={6 - otherDocuments.length}
            isOtherType
            initialDocuments={otherDocuments}
            onPressOther={() => otherDocRef.current?.snapToIndex(1)}
            error={''}
          />
          <UploadOtherCertificatesBottomSheet
            ref={otherDocRef}
            getAddedCertificate={asset => uploadOtherDocuments(asset)}
          />
          <Spacers size={16} type="vertical" />
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
