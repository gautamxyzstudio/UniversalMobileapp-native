import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Row} from '@components/atoms/Row';
import {IC_CROSS} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';

const EmployeeHomeChip = ({
  title,
  onPressCross,
}: {
  title: string;
  onPressCross: (text: string) => void;
}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <Row alignCenter style={styles.container}>
      <CustomText value={title} size={textSizeEnum.regular} />
      <TouchableOpacity onPress={() => onPressCross(title)}>
        <IC_CROSS width={verticalScale(20)} height={verticalScale(20)} />
      </TouchableOpacity>
    </Row>
  );
};

export default EmployeeHomeChip;

const createStyles = () => {
  const styles = StyleSheet.create({
    container: {
      marginVertical: verticalScale(12),
      backgroundColor: '#FFF2EA',
      borderRadius: 20,
      gap: verticalScale(4),
      paddingHorizontal: verticalScale(12),
      paddingVertical: verticalScale(7),
    },
  });
  return styles;
};
