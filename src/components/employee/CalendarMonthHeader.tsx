import {Pressable, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {monthYearGetter} from '@utils/utils.common';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {Row} from '@components/atoms/Row';
import {RIGHT_ARROW_DROPDOWN} from '@assets/exporter';
import MonthPicker from 'react-native-month-year-picker';
import {Portal} from 'react-native-paper';

const CalendarMonthHeader = () => {
  const [date, setDate] = useState<string>();
  const styles = useThemeAwareObject(getStyles);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  useEffect(() => {
    setDate(monthYearGetter());
  }, []);

  return (
    <>
      <Pressable onPress={() => setShowDatePicker(!showDatePicker)}>
        <Row alignCenter>
          <Text style={styles.heading}>{date}</Text>
          <RIGHT_ARROW_DROPDOWN style={styles.arrowDown} />
        </Row>
      </Pressable>
      {showDatePicker && (
        <Portal>
          <MonthPicker value={new Date()} />
        </Portal>
      )}
    </>
  );
};

export default CalendarMonthHeader;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    heading: {
      color: color.textPrimary,
      ...fonts.headingSmall,
    },
    arrowDown: {
      transform: [{rotate: '90deg'}],
    },
  });
  return styles;
};
