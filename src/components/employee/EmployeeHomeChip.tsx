import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Row} from '@components/atoms/Row';
import {IC_CROSS} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import {STRINGS} from 'src/locales/english';
import {dateFormatterToMonthDate} from '@utils/utils.common';
import {Theme} from '@theme/Theme.type';

const EmployeeHomeChip = ({
  title,
  onPressCross,
  startDate,
  customStyles,
  type = 'home',
  endDate,
}: {
  title: string;
  onPressCross: (text: string) => void;
  customStyles?: StyleProp<ViewStyle>;
  startDate: string | null;
  type?: 'search' | 'home';
  endDate: string | null;
}) => {
  const styles = useThemeAwareObject(createStyles);
  let dateRange = dateFormatterToMonthDate(startDate, endDate);

  return (
    <View style={customStyles}>
      {title === STRINGS.customDate && (
        <Row
          alignCenter
          style={type === 'home' ? styles.container : styles.containerSearch}>
          <CustomText
            color={type === 'home' ? 'textPrimary' : 'darkBlue'}
            value={dateRange ?? ''}
            size={textSizeEnum.regular}
          />
          <TouchableOpacity onPress={() => onPressCross(title)}>
            <IC_CROSS width={verticalScale(20)} height={verticalScale(20)} />
          </TouchableOpacity>
        </Row>
      )}
      {title !== STRINGS.customDate && (
        <Row
          alignCenter
          style={type === 'home' ? styles.container : styles.containerSearch}>
          <CustomText
            color={type === 'home' ? 'textPrimary' : 'darkBlue'}
            value={title}
            size={textSizeEnum.regular}
          />
          <TouchableOpacity onPress={() => onPressCross(title)}>
            <IC_CROSS width={verticalScale(20)} height={verticalScale(20)} />
          </TouchableOpacity>
        </Row>
      )}
    </View>
  );
};

export default EmployeeHomeChip;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      marginVertical: verticalScale(12),
      backgroundColor: '#FFF2EA',
      borderRadius: 20,
      gap: verticalScale(4),
      paddingHorizontal: verticalScale(12),
      paddingVertical: verticalScale(7),
    },
    containerSearch: {
      marginVertical: verticalScale(12),
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: '#FFF2EA',
      paddingHorizontal: 12,
      gap: verticalScale(4),
      paddingVertical: 9,
      borderColor: theme.color.strokeLight,
    },
  });
  return styles;
};
