import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';

export type IFilter = {
  id: number;
  value: string;
};

type IFiltersPropsTypes = {
  filters: IFilter[];
  onFilterPress: (filter: IFilter) => void;
  selectedFilterId: number;
};

const Filters: React.FC<IFiltersPropsTypes> = ({
  filters,
  onFilterPress,
  selectedFilterId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        horizontal>
        <View style={styles.spacer} />
        {filters.map(filter => (
          <Pressable
            onPress={() => onFilterPress(filter)}
            style={[
              styles.filter,
              selectedFilterId === filter.id && {
                backgroundColor: theme.color.darkBlue,
              },
            ]}
            key={filter.id}>
            <Text
              style={[
                styles.filterText,
                selectedFilterId === filter.id && {color: theme.color.primary},
              ]}>
              {filter.value}
            </Text>
          </Pressable>
        ))}
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default memo(Filters);

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    contentContainer: {
      gap: verticalScale(8),
    },
    filter: {
      paddingHorizontal: verticalScale(12),
      paddingVertical: verticalScale(7),
      borderRadius: 20,
      backgroundColor: theme.color.lightGrey,
    },
    filterText: {
      ...fonts.regular,
      color: theme.color.textPrimary,
    },
    spacer: {
      width: verticalScale(24),
    },
  });
  return styles;
};
