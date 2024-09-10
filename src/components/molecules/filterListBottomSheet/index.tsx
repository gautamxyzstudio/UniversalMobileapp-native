import {Pressable, ScrollView, Text, View} from 'react-native';
import React, {forwardRef, useState, useEffect} from 'react';
import {BaseBottomSheet} from '../bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {IFilterListBottomSheetProps, IFilterSheet} from './types';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {Row} from '@components/atoms/Row';
import {useTheme} from '@theme/Theme.context';
import CheckBox from '@components/atoms/checkbox';
import BottomButtonView from '@components/organisms/bottomButtonView';

const FilterListBottomSheet = forwardRef<
  BottomSheetModal,
  IFilterListBottomSheetProps
>(
  (
    {
      filters,
      snapPoints,
      title,
      isMultiSelect = true,
      buttonTitle,
      getAppliedFilters,
    },
    ref,
  ) => {
    const {theme} = useTheme();
    const styles = useThemeAwareObject(getStyles);
    const [filtersData, setFiltersData] = useState<IFilterSheet[]>(filters);
    const [selectedFilterHeading, setSelectedFilterHeading] =
      useState<IFilterSheet>(filters[0]);
    const [selectedOptionsMap, setSelectedOptionsMap] = useState(new Map());

    useEffect(() => {
      const initialSelectedOptions = new Map();
      filters.forEach(filterGroup => {
        filterGroup.value.forEach(filterOption => {
          initialSelectedOptions.set(
            filterOption.subTitle,
            filterOption.isSelected || false,
          );
        });
      });
      setSelectedOptionsMap(initialSelectedOptions);
      setFiltersData(filters);
    }, [filters]);

    const onClose = () => {
      //@ts-ignore
      ref.current?.snapToIndex(0);
    };

    const syncSelectionAcrossSections = (
      subTitle: string | undefined,
      isSelected: boolean,
    ) => {
      setFiltersData(prev => {
        const updatedFilters = prev.map(filterGroup => {
          return {
            ...filterGroup,
            value: filterGroup.value.map(filterOption => {
              if (filterOption.subTitle === subTitle) {
                return {...filterOption, isSelected};
              }
              return filterOption;
            }),
          };
        });
        return updatedFilters;
      });
    };

    const onPressCheckBox = (filterOption: {id: any; subTitle?: string}) => {
      const isSelected = !selectedOptionsMap.get(filterOption.subTitle);
      if (isMultiSelect) {
        setSelectedOptionsMap(prevMap => {
          const updatedMap = new Map(prevMap);
          updatedMap.set(filterOption.subTitle, isSelected);
          syncSelectionAcrossSections(filterOption.subTitle, isSelected);
          return updatedMap;
        });
      } else {
        setSelectedOptionsMap(prevMap => {
          const updatedMap = new Map();
          prevMap.forEach((value, key) => {
            updatedMap.set(key, false);
          });
          updatedMap.set(filterOption.subTitle, isSelected);
          syncSelectionAcrossSections(filterOption.subTitle, isSelected);
          return updatedMap;
        });
      }
    };

    const onPressApply = () => {
      const selectedFilters: string[] = [];

      selectedOptionsMap.forEach((value, key) => {
        if (value) {
          selectedFilters.push(key);
          onClose();
        }
      });
      getAppliedFilters(selectedFilters);
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
            {selectedFilterHeading.value.map(item => (
              <View key={item.id}>
                <CheckBox
                  spaceBetweenCheckboxAndText={20}
                  textStyles={styles.subtitle}
                  checkBoxClickHandler={() => onPressCheckBox(item)}
                  text={item.subTitle}
                  currentValue={selectedOptionsMap.get(item.subTitle)}
                />
              </View>
            ))}
          </View>
        </Row>
        <BottomButtonView
          disabled={false}
          onButtonPress={onPressApply}
          isMultiple
          title={buttonTitle ?? STRINGS.apply}
          secondaryButtonTitles={STRINGS.cancel}
        />
      </BaseBottomSheet>
    );
  },
);

export default FilterListBottomSheet;
