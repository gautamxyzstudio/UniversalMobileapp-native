import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {CALENDAR, ICONS} from '@assets/exporter';
import {DatePickerModal} from 'react-native-paper-dates';
import {getHistoryEndDate, getHistoryStartDate} from '@utils/utils.common';
import JobHistorySelectedRange from '@components/employee/JobHistorySelectedRange';
import {verticalScale} from '@utils/metrics';
import Spacers from '@components/atoms/Spacers';
import {CalendarDate} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import {userMockJobs} from '@api/mockData';
import CustomList from '@components/molecules/customList';
import JobCard, {IJobDetailsPropTypes} from '@components/employee/JobCard';
import {useTheme} from '@theme/Theme.context';
const EmployeeJobHistory = () => {
  const [range, setRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [open, setOpen] = React.useState(false);
  const {theme} = useTheme();
  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: CalendarDate;
      endDate: CalendarDate;
    }) => {
      setOpen(false);
      setRange({startDate, endDate});
    },
    [setOpen, setRange],
  );

  const renderItemListing = ({item}: {item: IJobDetailsPropTypes}) => {
    return <JobCard {...item} />;
  };

  return (
    <SafeAreaView hideBottomSpace>
      <View style={styles.headerContainer}>
        <StatusBar backgroundColor={theme.color.backgroundWhite} />
        <HeaderWithBack
          isDark
          renderRightIcon
          icon={CALENDAR}
          onPressRightIcon={() => setOpen(true)}
          headerTitle={STRINGS.history}
        />
      </View>
      <Spacers size={24} type="vertical" />
      {range.startDate && range.endDate && (
        <>
          <JobHistorySelectedRange
            startDate={range.startDate}
            endDate={range.endDate}
          />
          <Spacers size={24} type="vertical" />
        </>
      )}
      <View style={styles.list}>
        {/* <CustomList
          data={userMockJobs}
          renderItem={renderItemListing}
          getItemType={item => `${item.id}`}
          betweenItemSpace={12}
          estimatedItemSize={verticalScale(177)}
          error={undefined}
          isLastPage={false}
        /> */}
      </View>
      <DatePickerModal
        mode="range"
        validRange={{
          startDate: getHistoryStartDate(),
          endDate: getHistoryEndDate(),
        }}
        startYear={2023}
        locale="en"
        endYear={2024}
        calendarIcon={ICONS.schedules}
        closeIcon={ICONS.cross}
        editIcon={ICONS.edit}
        presentationStyle="pageSheet"
        visible={open}
        label="select Range"
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
      />
    </SafeAreaView>
  );
};

export default EmployeeJobHistory;

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: verticalScale(24),
  },
  list: {
    flex: 1,

    marginLeft: verticalScale(24),
  },
});
