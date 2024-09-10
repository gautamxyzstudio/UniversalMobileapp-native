/* eslint-disable @typescript-eslint/no-unused-vars */
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HorizontalCalendarItem from './HorizontalCalendarItem';
import moment, {Moment} from 'moment';
import Spacers from '@components/atoms/Spacers';
import CalendarStrip from 'react-native-calendar-strip';
import {
  getDateFromDuration,
  getYearEndAndStartDate,
} from '@utils/validationSchemas';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {Theme} from '@theme/Theme.type';
type IHorizontalCalendarPropTypes = {};

const HorizontalCalendar: React.FC<IHorizontalCalendarPropTypes> = ({}) => {
  const [dates, setDates] = useState<Moment[]>([]);
  const currentDate = moment();
  const {theme} = useTheme();
  const [date, setSelectedDate] = useState(currentDate);
  const styles = getStyles(theme);

  return (
    <View>
      <CalendarStrip
        style={{height: verticalScale(120)}}
        scrollable={true}
        selectedDate={date}
        daySelectionAnimation={{
          borderWidth: 1,
          type: 'border',
          duration: 100,
          borderHighlightColor: theme.color.darkBlue,
        }}
        dateNameStyle={styles.dateNameStyle}
        dateNumberStyle={styles.dateNumber}
        markedDates={[date]}
        markedDatesStyle={styles.markedDate}
        dayContainerStyle={styles.dayContainer}
        calendarHeaderStyle={styles.header}
        highlightDateContainerStyle={styles.highlightDate}
        iconLeftStyle={styles.arrow}
        responsiveSizingOffset={10}
        iconRightStyle={styles.arrow}
        highlightDateNameStyle={styles.dateName}
        highlightDateNumberStyle={styles.highlightDateNumber}
        scrollerPaging={true}
        minDate={getYearEndAndStartDate('start')}
        maxDate={getYearEndAndStartDate('end')}
      />
    </View>
  );
};

export default HorizontalCalendar;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    arrow: {
      marginHorizontal: verticalScale(10),
    },
    dateNumber: {
      color: theme.color.disabled,
      fontWeight: '400',
      ...fonts.small,
    },
    dayContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      width: verticalScale(37),
      height: verticalScale(46),
    },
    header: {
      color: theme.color.textPrimary,
      ...fonts.headingSmall,
    },
    highlightDate: {
      width: verticalScale(37),
      height: verticalScale(46),
      overflow: 'visible',
      paddingTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    markedDate: {
      width: verticalScale(6),
      height: verticalScale(6),
      backgroundColor: theme.color.accent,
      borderRadius: verticalScale(3),
    },
    dateName: {
      color: theme.color.darkBlue,
      ...fonts.smallBold,
    },
    highlightDateNumber: {
      color: theme.color.darkBlue,
      marginTop: 1,
      ...fonts.smallBold,
    },
    dateNameStyle: {
      color: theme.color.disabled,
      ...fonts.small,
    },
  });
