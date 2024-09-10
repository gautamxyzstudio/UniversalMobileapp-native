import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment, {Moment} from 'moment';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';

type IHorizontalCalendarItemPropTypes = {
  date: Moment;
  onSelectDate: () => void;
  selected: Moment;
  isWorkedOn: boolean;
};

const HorizontalCalendarItem: React.FC<IHorizontalCalendarItemPropTypes> = ({
  date,
  onSelectDate,
  selected,
  isWorkedOn,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const day = moment(date).format('ddd');
  const dayNumber = moment(date).format('D');
  const fullDate = moment(date).format('YYYY-MM-DD');
  const selectedDate = moment(selected).format('YYYY-MM-DD');

  const isSelected = fullDate === selectedDate;

  // Ensure that onPress correctly calls onSelectDate
  const handlePress = () => {
    onSelectDate(); // Trigger parent's state update
  };

  return (
    <View style={styles.outerView}>
      <TouchableOpacity
        onPress={handlePress} // Ensure onPress calls handlePress
        style={[styles.innerContainer, isSelected && styles.containerSelected]}>
        <Text style={[styles.day, isSelected && styles.dayBold]}>{day}</Text>
        <Text style={[styles.date, isSelected && styles.dateBold]}>
          {dayNumber}
        </Text>
      </TouchableOpacity>
      {isWorkedOn && <View style={styles.dot} />}
    </View>
  );
};

export default HorizontalCalendarItem;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    day: {
      color: color.disabled,
      ...fonts.small,
    },
    dayBold: {
      color: color.darkBlue,
      ...fonts.smallBold,
    },
    dateBold: {
      color: color.darkBlue,
      ...fonts.mediumBold,
    },
    date: {
      color: color.disabled,
      ...fonts.medium,
    },
    outerView: {
      height: verticalScale(72),
      paddingBottom: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: verticalScale(36),
    },
    innerContainer: {
      width: verticalScale(36),
      justifyContent: 'space-between',
      paddingVertical: verticalScale(9),
      alignItems: 'center',
      height: verticalScale(56),
    },
    containerSelected: {
      borderWidth: 1,
      borderColor: color.darkBlue,
      borderRadius: 40,
    },
    dot: {
      width: verticalScale(6),
      height: verticalScale(6),
      backgroundColor: color.accent,
      borderRadius: verticalScale(3),
    },
  });
  return styles;
};
