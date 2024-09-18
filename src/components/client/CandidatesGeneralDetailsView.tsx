import {StyleSheet, View} from 'react-native';
import React from 'react';
import {verticalScale} from '@utils/metrics';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import Spacers from '@components/atoms/Spacers';

const GeneralDetailKeyView = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => (
  <View>
    <CustomText color="disabled" value={title} size={textSizeEnum.regular} />
    <CustomText
      marginTop={verticalScale(4)}
      value={value}
      size={textSizeEnum.regular}
    />
  </View>
);

const CandidatesGeneralDetailsView = () => {
  return (
    <View style={styles.container}>
      <GeneralDetailKeyView title={'Date of birth'} value={'04/08/2000'} />
      <Spacers size={24} scalable type={'vertical'} />
      <GeneralDetailKeyView title={'Work Status'} value={'Full-time'} />
      <Spacers size={24} scalable type={'vertical'} />
      <GeneralDetailKeyView title={'Gender'} value={'Female'} />
    </View>
  );
};

export default CandidatesGeneralDetailsView;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: verticalScale(24),
    marginTop: verticalScale(24),
  },
});
