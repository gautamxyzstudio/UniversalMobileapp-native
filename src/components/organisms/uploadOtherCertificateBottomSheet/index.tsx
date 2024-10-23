import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {moderateScale, verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import CustomTextInput from '@components/atoms/customtextInput';
import BottomButtonView from '../bottomButtonView';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import DocUploadView from '@components/doucment/DocUploadView';
import SelectImagePopup from '@components/molecules/selectimagepopup';
import {ISelectedAsset} from '@components/molecules/selectimagepopup/types';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {fontFamily, fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import UploadedAssetCard from '@components/doucment/UploadedAssetCard';
import {IFile} from '../uploadPopup/types';
import {setFileName} from '@utils/constants';
import {useTheme} from '@theme/Theme.context';

export interface IOtherDocument extends IFile {
  name?: string;
}

const UploadOtherCertificatesBottomSheet = React.forwardRef<
  BottomSheetModal,
  {
    getAddedCertificate: (certificate: IOtherDocument) => void;
  }
>(({getAddedCertificate}, ref) => {
  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };
  const styles = useThemeAwareObject(getStyles);
  const keyboardHeight = useKeyboardHeight();
  const modalHeight = verticalScale(450);
  const {theme} = useTheme();
  const compRef = useRef<BottomSheetMethods | null>(null);
  const snapPoints = useMemo(
    () => [0.01, modalHeight, modalHeight + keyboardHeight / 1.5],
    [modalHeight, keyboardHeight],
  );
  const [state, setState] = useState<{
    inputName: string;
    error: string;
    selectedDocError: string;
    selectedDoc: ISelectedAsset | null;
  }>({
    inputName: '',
    error: '',
    selectedDocError: '',
    selectedDoc: null,
  });
  function handleSelectedAssets(asset: ISelectedAsset): void {
    setState(prev => ({...prev, selectedDoc: asset, selectedDocError: ''}));
  }

  const displayPopup = () => {
    compRef.current?.snapToIndex(1);
  };

  const onPressCross = () => {
    setState(prev => ({...prev, selectedDoc: null}));
  };

  const onPressAdd = () => {
    if (!state.inputName) {
      setState(prev => ({...prev, error: STRINGS.document_name_required}));
      return;
    }
    if (!state.selectedDoc) {
      setState(prev => ({
        ...prev,
        selectedDocError: STRINGS.please_select_doc_to_upload,
      }));
      return;
    }
    let asset: any = {
      ...state.selectedDoc?.assets[0],
      status: 'pending',
      fileName: setFileName(
        state.selectedDoc?.assets[0].fileName ?? '',
        state.inputName,
      ),
    };
    getAddedCertificate({...asset, name: state.inputName});
    setState({
      inputName: '',
      selectedDoc: null,
      error: '',
      selectedDocError: '',
    });
    onClose();
  };

  return (
    <BaseBottomSheet
      ref={ref}
      headerTitle={STRINGS.other}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <CustomTextInput
          title={STRINGS.document_name}
          value={state.inputName}
          onChangeText={e =>
            setState(prev => ({...prev, inputName: e, error: ''}))
          }
          errorMessage={state.error}
        />
        <View
          style={[
            styles.docContainer,
            state.selectedDocError ? {borderColor: theme.color.red} : {},
          ]}>
          <Text style={styles.title}>{STRINGS.doc}</Text>
          {state.selectedDoc && (
            <UploadedAssetCard
              fileName={state.selectedDoc.assets[0].fileName}
              size={state.selectedDoc.assets[0].size}
              uploadStatus={'success'}
              onPressCross={onPressCross}
              retryOnFailure={() => console.log('')}
            />
          )}
          {!state.selectedDoc && <DocUploadView onPresUpload={displayPopup} />}
        </View>
        {state.selectedDocError && (
          <Text style={styles.errorText}>{state.selectedDocError}</Text>
        )}
      </View>
      <BottomButtonView
        disabled={false}
        isMultiple
        title={STRINGS.add}
        secondaryButtonTitles={STRINGS.cancel}
        onPressSecondaryButton={onClose}
        onButtonPress={() => onPressAdd()}
      />
      <SelectImagePopup
        isDocumentMultiple={false}
        selectionLimit={1}
        getSelectedImages={asset => handleSelectedAssets(asset)}
        compRef={compRef}
      />
    </BaseBottomSheet>
  );
});

export default UploadOtherCertificatesBottomSheet;
export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: verticalScale(24),
      paddingTop: verticalScale(24),
    },
    docContainer: {
      height: verticalScale(124),
      borderWidth: 1,
      paddingVertical: verticalScale(24),
      marginTop: verticalScale(26),
      borderColor: theme.color.grey,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    title: {
      paddingHorizontal: verticalScale(8),
      backgroundColor: '#fff',
      position: 'absolute',
      left: verticalScale(16),
      top: verticalScale(-8),
      ...fonts.small,
      color: theme.color.disabled,
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.color.red,
      fontFamily: fontFamily.regular,
      marginTop: verticalScale(2),
    },
  });
  return styles;
};
