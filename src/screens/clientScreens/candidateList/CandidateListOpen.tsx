import {StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import CandidateCard from '@components/client/CandidateCard';
import CustomList from '@components/molecules/customList';
import {CandidateListPendingData, ICandidate} from '@api/mockData';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import CandidateDetailsBottomSheet from './CandidateDetailsBottomSheet';

const CandidateListOpen = () => {
  const styles = useThemeAwareObject(getStyles);
  const compRef = useRef<BottomSheetModalMethods | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate>();

  const onPressCandidate = (item: ICandidate) => {
    setSelectedCandidate(item);
    setTimeout(() => {
      compRef.current?.snapToIndex(1);
    }, 200);
  };

  const renderItem = ({item}: {item: ICandidate}) => (
    <CandidateCard item={item} onPressCard={onPressCandidate} />
  );

  return (
    <View style={styles.container}>
      <CustomList
        renderItem={renderItem}
        data={CandidateListPendingData}
        error={undefined}
        estimatedItemSize={verticalScale(72.66)}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />

      <CandidateDetailsBottomSheet ref={compRef} details={selectedCandidate} />
    </View>
  );
};

export default CandidateListOpen;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
    footer: {
      height: verticalScale(100),
    },
  });
  return styles;
};
