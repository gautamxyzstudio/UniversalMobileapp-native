import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {ICandidate} from '@api/mockData';
import {windowHeight} from '@utils/metrics';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';

type ICandidateDetailsBottomSheet = {
  details: ICandidate | undefined;
};

const CandidateDetailsBottomSheet = React.forwardRef<
  BottomSheetModalMethods,
  ICandidateDetailsBottomSheet
>(({details}, ref) => {
  const height = windowHeight * 0.75;
  const snapPoints = [0.1, height];

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };
  return (
    <BaseBottomSheet snapPoints={snapPoints} ref={ref} onClose={onClose}>
      <Text>CandidateDetailsView</Text>
    </BaseBottomSheet>
  );
});

export default CandidateDetailsBottomSheet;

const styles = StyleSheet.create({});
