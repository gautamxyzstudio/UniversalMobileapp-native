import {StyleSheet, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {verticalScale} from '@utils/metrics';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import {STRINGS} from 'src/locales/english';
import DropdownComponent, {
  IDropDownItem,
} from '@components/molecules/dropdownPopup';
import Spacers from '@components/atoms/Spacers';
import UploadDocView from '@components/organisms/uploadPopup';
import CustomTextInput from '@components/atoms/customtextInput';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {IDoc} from '@api/features/user/types';

export type INewSelectedDocument = {
  name: string;
  docType: string;
  docValue: number;
};

type IUploadNewDocumentFromProfilePopupProps = {
  documentTypes: IDropDownItem[];
  getSelectedDocument: (doc: INewSelectedDocument) => void;
};

const UploadNewDocumentFromProfilePopup = React.forwardRef<
  BottomSheetMethods,
  IUploadNewDocumentFromProfilePopupProps
>(({documentTypes, getSelectedDocument}, ref) => {
  const initialState = {
    docName: '',
    docType: null,
    docValue: null,
    docNameError: '',
    document: null,
    docTypeError: '',
    docValueError: '',
  };
  const modalHeight = verticalScale(570);
  const keyboardHeight = useKeyboardHeight();
  const [state, setState] = useState<{
    docType: IDropDownItem | null;
    docName: string;
    docValue: number | null;
    docTypeError: string;
    docValueError: string;
    docNameError: string;
  }>({
    docName: '',
    docType: null,
    docValue: null,
    docNameError: '',
    docTypeError: '',
    docValueError: '',
  });
  const snapPoints = useMemo(
    () => [0.01, modalHeight, modalHeight + keyboardHeight / 2],
    [modalHeight, keyboardHeight],
  );

  const [files, setFiles] = useState<IDoc[] | [] | undefined>(undefined);

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
    setState(initialState);
    setFiles([]);
  };

  const onSelectDocType = (e: IDropDownItem) => {
    setState(prev => ({
      ...prev,
      docType: e,
      docTypeError: '',
      docNameError: '',
      docValueError: '',
      document: null,
      docName: '',
      docValue: null,
    }));
    setFiles([]);
  };

  const addNewDocHandler = async () => {
    let isValid = true;
    if (!state.docType) {
      isValid = false;
      setState(prev => ({
        ...prev,
        docTypeError: STRINGS.document_type_required,
      }));
    } else if (!state.docName && state.docType.value === STRINGS.new_document) {
      isValid = false;
      setState(prev => ({
        ...prev,
        docNameError: STRINGS.document_name_required,
      }));
    } else if (!state.docValue) {
      isValid = false;
      setState(prev => ({
        ...prev,
        docValueError: STRINGS.document_required,
      }));
    }
    if (isValid && state.docValue && state.docType) {
      getSelectedDocument({
        name: state.docName,
        docValue: state.docValue,
        docType: state.docType.value,
      });

      onClose();
    }
  };

  return (
    <BaseBottomSheet
      headerTitle={STRINGS.new_document}
      ref={ref}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <DropdownComponent
          title={STRINGS.document_type}
          onChangeValue={onSelectDocType}
          error={state.docTypeError}
          value={state.docType?.value ?? ''}
          data={documentTypes}
        />
        {state.docType?.value === STRINGS.new_document && (
          <>
            <Spacers type="vertical" size={16} />
            <CustomTextInput
              value={state.docName}
              onTextChange={e =>
                setState(prev => ({...prev, docName: e, docNameError: ''}))
              }
              title={STRINGS.doc_name}
              errorMessage={state.docNameError}
            />
          </>
        )}
        <Spacers type="vertical" size={16} />
        <UploadDocView
          getSelectedDocumentIds={ids => setState({...state, docValue: ids[0]})}
          title={STRINGS.doc}
          initialDocuments={files as []}
          error={state.docValueError}
        />
      </View>
      <BottomButtonView
        disabled={false}
        secondaryButtonTitles={STRINGS.cancel}
        title={STRINGS.done}
        isMultiple
        onButtonPress={addNewDocHandler}
      />
    </BaseBottomSheet>
  );
});

export default UploadNewDocumentFromProfilePopup;

const styles = StyleSheet.create({
  container: {
    padding: verticalScale(24),
    flex: 1,
  },
});
