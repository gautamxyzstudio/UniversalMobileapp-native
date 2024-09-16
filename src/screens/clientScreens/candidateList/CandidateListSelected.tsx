import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import CandidateCard from '@components/client/CandidateCard';
import CustomList from '@components/molecules/customList';
import {CandidateListSelectedData, ICandidate} from '@api/mockData';

const CandidateListSelected = () => {
  const styles = useThemeAwareObject(getStyles);

  const renderItem = ({item}: {item: ICandidate}) => (
    <CandidateCard
      item={item}
      onPressCard={function (item: ICandidate): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
  return (
    <View style={styles.container}>
      {/* <CustomList
        renderItem={renderItem}
        data={CandidateListSelectedData}
        error={undefined}
        ListFooterComponentStyle={{height: 100}}
        isLastPage={true}
      /> */}
    </View>
  );
};

export default CandidateListSelected;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
  });
  return styles;
};
