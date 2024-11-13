/* eslint-disable react-hooks/exhaustive-deps */
import {Pressable, ScrollView, Text, View} from 'react-native';
import React, {forwardRef, useState, useEffect} from 'react';
import {BaseBottomSheet} from '../bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  filterValue,
  IFilterListBottomSheetProps,
  IFilterSheet,
  ISelectedOption,
} from './types';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {Row} from '@components/atoms/Row';
import {useTheme} from '@theme/Theme.context';
import CheckBox from '@components/atoms/checkbox';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {CALENDAR, ICONS} from '@assets/exporter';
import {getHistoryStartDate, jobRangeFormatter} from '@utils/utils.common';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import {DatePickerModal} from 'react-native-paper-dates';
import {CalendarDate} from 'react-native-paper-dates/lib/typescript/Date/Calendar';

const FilterListBottomSheet = forwardRef<
  BottomSheetModal,
  IFilterListBottomSheetProps
>(
  (
    {
      filters,
      snapPoints,
      title,
      onPressClear,
      selectionType,
      buttonTitle,
      filterDate,
      getAppliedFilters,
      initialSelectedOptions,
    },
    ref,
  ) => {
    const {theme} = useTheme();
    const styles = useThemeAwareObject(getStyles);
    const [filtersData, setFiltersData] = useState<IFilterSheet[]>(filters);
    const [selectedFilterHeading, setSelectedFilterHeading] =
      useState<IFilterSheet>(filters[0]);
    const [currentSelectedOption, setCurrentSelectedOption] =
      useState<filterValue | null>(null);

    const [selectedOptionsMap, setSelectedOptionsMap] =
      useState<ISelectedOption>(new Map());
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState<{
      startDate: Date | undefined;
      endDate: Date | undefined;
    }>({
      startDate: undefined,
      endDate: undefined,
    });

    const jobRange = `${
      range.startDate ? jobRangeFormatter(range.startDate) : ''
    } ${range.endDate ? ` - ${jobRangeFormatter(range.endDate)}` : ''}`;

    useEffect(() => {
      const initialSelectedOptionsMap: ISelectedOption = new Map();
      if (initialSelectedOptions && initialSelectedOptions.length > 0) {
        filters.forEach(filterGroup => {
          filterGroup.value.forEach(filterOption => {
            initialSelectedOptions.forEach(option => {
              if (filterOption.subTitle === option) {
                initialSelectedOptionsMap.set(filterOption.subTitle, {
                  ...filterOption,
                  isSelected: true,
                });
              }
            });
          });
        });
      }
      setSelectedOptionsMap(initialSelectedOptionsMap);
      setFiltersData(filters);
    }, [filters, initialSelectedOptions]);

    useEffect(() => {
      if (filterDate?.startDate && filterDate?.endDate) {
        setRange(filterDate);
      }
    }, [filterDate]);

    const syncSelectionAcrossSections = (selectedValue: filterValue) => {
      setFiltersData(prev => {
        const updatedFilters = prev.map(filterGroup => {
          return {
            ...filterGroup,
            value: filterGroup.value.map(filterOption => {
              if (filterOption.id === selectedValue.id) {
                return {...selectedValue};
              }
              return filterOption;
            }),
          };
        });
        return updatedFilters;
      });
    };

    const onDismiss = () => {
      setOpen(false);
    };

    const onPressCheckBox = (filterOption: filterValue) => {
      const selectedOption: filterValue = {...filterOption, isSelected: true};
      if (selectionType === 'multiSelect') {
        setSelectedOptionsMap(prevMap => {
          const updatedMap = new Map(prevMap);
          if (updatedMap.has(selectedOption.subTitle)) {
            updatedMap.delete(selectedOption.subTitle);
          } else {
            updatedMap.set(selectedOption.subTitle, selectedOption);
          }
          syncSelectionAcrossSections(selectedOption);
          return updatedMap;
        });
      } else if (selectionType === 'singleOptionSelect') {
        setSelectedOptionsMap(prevMap => {
          const updatedMap = new Map(prevMap);
          updatedMap.clear();
          updatedMap.set(filterOption.subTitle, selectedOption);
          syncSelectionAcrossSections(selectedOption);
          return updatedMap;
        });
      } else if (selectionType === 'singleSelect') {
        setSelectedOptionsMap(prevMap => {
          const updatedMap = new Map(prevMap);
          if (updatedMap.has(selectedOption.subTitle)) {
            updatedMap.delete(selectedOption.subTitle);
          } else {
            updatedMap.forEach((option, key) => {
              if (option.rowId === selectedOption.rowId) {
                updatedMap.delete(key);
              }
            });
            updatedMap.set(filterOption.subTitle, selectedOption);
          }

          return updatedMap;
        });
      }
    };

    const onConfirm = React.useCallback(
      ({
        startDate,
        endDate,
      }: {
        startDate: CalendarDate;
        endDate: CalendarDate;
      }) => {
        setOpen(false);
        if (startDate && endDate && currentSelectedOption) {
          setRange({startDate, endDate});
          onPressCheckBox(currentSelectedOption);
        }
      },
      [setOpen, setRange, currentSelectedOption],
    );

    const onPressApply = () => {
      const selectedFilters: string[] = [];
      selectedOptionsMap.forEach((value, key) => {
        if (value) {
          selectedFilters.push(key);
        }
      });
      onClose();
      getAppliedFilters(
        selectedFilters,
        range.startDate && range.endDate
          ? {startDate: range.startDate, endDate: range.endDate}
          : undefined,
      );
    };

    const onClose = () => {
      //@ts-ignore
      ref.current?.snapToIndex(0);
    };

    const onPressCustomDate = (item: filterValue) => {
      setCurrentSelectedOption(item);
      setOpen(true);
    };

    return (
      <BaseBottomSheet
        modalStyles={styles.modal}
        snapPoints={snapPoints}
        ref={ref}
        headerTitle={title ?? STRINGS.filter}
        onClose={onClose}>
        <Row style={styles.mainView}>
          <View style={styles.filterOptionContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterOptionContainer}>
                {filtersData.map(item => (
                  <Pressable
                    onPress={() => setSelectedFilterHeading(item)}
                    key={item.id}
                    style={[
                      styles.filterOptionTitleContainer,
                      selectedFilterHeading.id === item.id && {
                        backgroundColor: theme.color.primary,
                      },
                    ]}>
                    <Text style={styles.filterOptionTitle}>{item.title}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.options}>
            {selectedFilterHeading?.value.map(item => (
              <View key={item.id}>
                {item.subTitle === STRINGS.customDate ? (
                  <>
                    <Row alignCenter>
                      <CheckBox
                        spaceBetweenCheckboxAndText={20}
                        textStyles={styles.subtitle}
                        checkBoxClickHandler={() => onPressCustomDate(item)}
                        text={item.subTitle}
                        currentValue={
                          selectedOptionsMap.get(item.subTitle)?.isSelected
                        }
                      />
                      <CALENDAR />
                    </Row>
                    {selectedOptionsMap.get(item.subTitle)?.isSelected &&
                      range.startDate &&
                      range.endDate && (
                        <CustomText
                          value={jobRange}
                          color="disabled"
                          size={textSizeEnum.small}
                        />
                      )}
                  </>
                ) : (
                  <CheckBox
                    spaceBetweenCheckboxAndText={20}
                    textStyles={styles.subtitle}
                    checkBoxClickHandler={() =>
                      onPressCheckBox({
                        ...item,
                        rowId: selectedFilterHeading.id,
                      })
                    }
                    text={item.subTitle}
                    currentValue={
                      selectedOptionsMap.get(item.subTitle)?.isSelected
                    }
                  />
                )}
              </View>
            ))}
          </View>
        </Row>
        <BottomButtonView
          disabled={selectedOptionsMap.size === 0}
          onButtonPress={onPressApply}
          secondaryButtonStyles={styles.secondaryButton}
          secondaryButtonTitleStyles={styles.secondaryButtonTitleStyles}
          onPressSecondaryButton={onPressClear}
          isMultiple
          title={buttonTitle ?? STRINGS.apply}
          secondaryButtonTitles={STRINGS.clearAll}
        />
        <DatePickerModal
          mode="range"
          validRange={{
            startDate: getHistoryStartDate(),
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
      </BaseBottomSheet>
    );
  },
);

export default FilterListBottomSheet;
