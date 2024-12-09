import {ScrollView, StyleSheet, View} from 'react-native';
import React, {forwardRef, useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import SelectedDocumentToUpdateCard from './SelectedDocumentToUpdateCard';
import BottomButtonView from '@components/organisms/bottomButtonView';

type ISelectDocumentToUpdatePopupTypes = {
  addOrUpdateDocument: (selectedOption: {name: string; key: string}) => void;
  documents: {name: string; key: string}[];
};

const SelectDocumentToUpdatePopup = forwardRef<
  BottomSheetModal,
  ISelectDocumentToUpdatePopupTypes
>(({addOrUpdateDocument, documents}, ref) => {
  const [selectedOption, setSelectedOption] = useState<{
    name: string;
    key: string;
  }>();

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };

  return (
    <BaseBottomSheet
      ref={ref}
      snapPoints={[0.01, verticalScale(628)]}
      headerTitle={STRINGS.select_the_document}
      onClose={onClose}>
      <View style={styles.mainView}>
        <ScrollView>
          <View style={styles.itemView}>
            {documents.map((item, index) => (
              <SelectedDocumentToUpdateCard
                key={index}
                title={item.name}
                isSelected={selectedOption?.name === item.name}
                onPressCard={() => setSelectedOption(item)}
              />
            ))}
          </View>
        </ScrollView>
        <BottomButtonView
          disabled={false}
          isMultiple
          secondaryButtonTitles={STRINGS.cancel}
          title={STRINGS.addUpdate}
          buttonType="outline"
          onPressSecondaryButton={onClose}
          onButtonPress={() => {
            if (selectedOption) {
              addOrUpdateDocument(selectedOption);
              onClose();
            }
          }}
        />
      </View>
    </BaseBottomSheet>
  );
});

export default SelectDocumentToUpdatePopup;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: verticalScale(24),
    marginTop: verticalScale(24),
  },
  itemView: {
    gap: verticalScale(12),
  },
});
